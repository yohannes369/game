import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const API_ROOT = import.meta.env.VITE_API_URL || window.location.origin;
const MEDIA_ROOT = import.meta.env.VITE_MEDIA_URL || API_ROOT.replace(/\/api\/?$/, '');
const SOCKET_ROOT = import.meta.env.VITE_SOCKET_URL || API_ROOT.replace(/\/api\/?$/, '');
const SUPPORT_ADMIN_ID = Number(import.meta.env.VITE_SUPPORT_ADMIN_ID || 0);

const isAbsoluteUrl = (value) => typeof value === 'string' && /^(https?:)?\/\//i.test(value);
const getRemoteUrl = (path) => {
  if (!path) return null;
  if (isAbsoluteUrl(path)) return path;
  return `${MEDIA_ROOT.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
};

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function Chat() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const isAdmin = user?.role === 'admin';
  const queryUserId = searchParams.get('userId');
  const targetUserId = isAdmin ? Number(queryUserId) : user?.id;
  const supportAdminId = isAdmin ? Number(user?.id) : SUPPORT_ADMIN_ID;
  const receiverId = isAdmin ? targetUserId : supportAdminId;
  const hasConversationContext = Boolean(user && (!isAdmin || targetUserId));
  const chatTargetLabel = isAdmin ? `User #${targetUserId}` : t('chat.support', 'Support Admin');
  const showAdminUserSelect = isAdmin && !queryUserId;

  const accessToken = useMemo(() => localStorage.getItem('accessToken'), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!audioBlob) {
      setAudioPreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(audioBlob);
    setAudioPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [audioBlob]);

  useEffect(() => {
    if (!user || !showAdminUserSelect) {
      return;
    }

    setUsersLoading(true);
    api
      .get('/users')
      .then((response) => {
        const users = response.data?.users || [];
        setAvailableUsers(users.filter((u) => u.id !== user?.id));
      })
      .catch((error) => {
        console.warn('Failed to load users for admin chat:', error);
        setErrorMessage(t('chat.loadUsersError', 'Unable to load users for admin chat.'));
      })
      .finally(() => setUsersLoading(false));
  }, [user, showAdminUserSelect, t]);

  useEffect(() => {
    if (!user || !hasConversationContext) {
      setLoading(false);
      return;
    }

    let mounted = true;
    const socket = io(SOCKET_ROOT, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current = socket;

    const handleIncomingMessage = (incoming) => {
      if (!incoming) return;
      const conversationId = Number(incoming.conversation_id ?? incoming.conversationId ?? incoming.conversation);
      const currentConversationId = Number(conversation?.id);
      if (!conversation || conversationId === currentConversationId) {
        setMessages((prev) => [...prev, incoming]);
      }
    };

    const joinConversationRoom = (conv) => {
      if (!conv?.id) return;
      socket.emit('join_conversation', conv.id);
    };

    socket.on('connect', () => {
      console.log('Chat socket connected:', socket.id);
      joinConversationRoom(conversation);
    });

    socket.on('disconnect', (reason) => {
      console.log('Chat socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('Chat socket connect error:', err?.message || err);
    });

    socket.on('chat_message', handleIncomingMessage);

    const initChat = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const requestBody = isAdmin
          ? { admin_id: supportAdminId, user_id: targetUserId }
          : { user_id: targetUserId };

        const response = await api.post('/chat/conversations', requestBody);

        const conv = response.data?.data;
        if (!conv) {
          throw new Error(t('chat.openConversationError', 'Unable to open chat conversation.'));
        }

        if (!mounted) return;
        setConversation(conv);
        joinConversationRoom(conv);
        await loadMessages(conv.id);
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(error.response?.data?.message || error.message || t('chat.loadError', 'Unable to load chat conversation.'));
        console.error('Chat init failed:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      mounted = false;
      socket.disconnect();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [user, hasConversationContext, supportAdminId, targetUserId, accessToken, t]);

  const loadMessages = async (conversationId) => {
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages?limit=200`);
      setMessages(response.data?.data || []);
      await api.patch(`/chat/conversations/${conversationId}/read`, {
        reader_id: user.id,
        role: isAdmin ? 'admin' : 'user',
      });
    } catch (error) {
      console.warn('Failed to load chat messages:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    setAudioBlob(null);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage(t('chat.recordingNotSupported', 'Audio recording is not supported in this browser.'));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    } catch (error) {
      console.error('Recording failed:', error);
      setErrorMessage(t('chat.recordingError', 'Unable to start audio recording.'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!conversation) return;
    if (!newMessage.trim() && !selectedFile && !audioBlob) return;

    setSending(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('conversation_id', conversation.id);
      formData.append('sender_id', user.id);
      formData.append('receiver_id', receiverId);

      if (audioBlob) {
        formData.append('message_type', 'voice');
        formData.append('attachment', audioBlob, 'voice-message.webm');
        formData.append('voice_duration', recordingTime);
        if (newMessage.trim()) formData.append('message_text', newMessage.trim());
      } else if (selectedFile) {
        formData.append('message_type', 'image');
        formData.append('attachment', selectedFile);
        if (newMessage.trim()) formData.append('message_text', newMessage.trim());
      } else {
        formData.append('message_type', 'text');
        formData.append('message_text', newMessage.trim());
      }

      const response = await api.post('/chat/messages', formData);
      const sentMessage = response.data?.data;
      if (sentMessage) {
        setMessages((prev) => [...prev, sentMessage]);
      }
      setNewMessage('');
      clearSelectedFile();
      cancelRecording();
    } catch (error) {
      console.error('Send message failed:', error);
      setErrorMessage(error.response?.data?.message || t('chat.sendError', 'Unable to send message.'));
    } finally {
      setSending(false);
    }
  };

  const renderAttachment = (message) => {
    const fileUrl = message.file_url || message.fileUrl;
    if (!fileUrl) return null;
    const remoteUrl = getRemoteUrl(fileUrl);

    if (message.message_type === 'image') {
      return (
        <img
          src={remoteUrl}
          alt={t('chat.imageAttachment', 'Image attachment')}
          className="mt-3 max-w-full rounded-2xl border border-slate-200 object-cover"
        />
      );
    }

    if (message.message_type === 'voice') {
      return <audio controls src={remoteUrl} className="mt-3 w-full" />;
    }

    return null;
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-slate-700">
        {t('chat.loginRequired', 'Please log in to use chat.')}
      </div>
    );
  }

  if (showAdminUserSelect) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-semibold text-slate-900">{t('chat.selectUserTitle', 'Choose a user to begin support chat')}</h1>
            <p className="mt-2 text-sm text-slate-600">
              {t('chat.selectUserDescription', 'Select a user conversation to open the chat interface.')}
            </p>
          </div>

          <div className="p-6">
            {usersLoading ? (
              <div className="text-slate-500">{t('common.loading', 'Loading messages...')}</div>
            ) : availableUsers.length === 0 ? (
              <div className="text-slate-700">
                <p className="text-lg font-medium mb-2">{t('chat.noUsersFound', 'No users available yet.')}</p>
                <p className="text-sm text-slate-600">
                  {t('chat.noUsersDescription', 'Create users or open a user support conversation from the users list.')}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {availableUsers.map((userOption) => (
                  <Link
                    key={userOption.id}
                    to={`/admin/chat?userId=${userOption.id}`}
                    className="block rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:border-blue-200 hover:bg-white transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">{userOption.fullName || userOption.username}</h2>
                        <p className="text-sm text-slate-600">{userOption.username}</p>
                      </div>
                      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {t('chat.openChat', 'Open Chat')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!hasConversationContext) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-slate-700">
        <h2 className="text-xl font-semibold mb-2">{t('chat.missingContext', 'Chat target not configured')}</h2>
        <p className="text-sm text-slate-600">
          {isAdmin
            ? t('chat.adminSelectUser', 'Open admin chat by adding ?userId=USER_ID to the URL.')
            : t('chat.supportUnavailable', 'Support chat is not configured. Please ask an administrator to set VITE_SUPPORT_ADMIN_ID.')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[84vh]">
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <p className="text-sm text-slate-500">{t('chat.openConversation', 'Chat conversation')}</p>
            <h1 className="text-xl font-semibold text-slate-900">{chatTargetLabel}</h1>
          </div>
          {conversation?.status && (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${conversation.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {conversation.status}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-5 space-y-4 bg-slate-50">
            {loading ? (
              <div className="text-center py-16 text-slate-500">{t('common.loading', 'Loading messages...')}</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                {t('chat.noMessagesYet', 'No messages yet. Send the first one to start the chat!')}
              </div>
            ) : (
              messages.map((message, index) => {
                const isMe = message.sender_id === user.id || message.senderId === user.id;
                return (
                  <div key={message.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-3xl p-4 shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'}`}>
                      {!isMe && (
                        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-blue-600">
                          {message.sender_name || message.senderName || t('chat.agent', 'Support')}
                        </div>
                      )}
                      {message.message_text && <div className="whitespace-pre-wrap text-sm leading-6">{message.message_text}</div>}
                      {renderAttachment(message)}
                      {message.voice_duration ? (
                        <div className="mt-2 text-[11px] text-slate-300">{formatDuration(message.voice_duration)}</div>
                      ) : null}
                      <div className="mt-3 text-[11px] text-slate-300 text-right">{formatDate(message.created_at || message.createdAt)}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          {errorMessage && (
            <div className="mb-3 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>
          )}

          {(filePreview || audioPreviewUrl) && (
            <div className="mb-3 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {filePreview && (
                <div className="flex items-center gap-3">
                  <img src={filePreview} alt="Preview" className="h-20 w-20 rounded-2xl object-cover border border-slate-200" />
                  <div className="flex-1 text-sm text-slate-700">{selectedFile?.name}</div>
                  <button type="button" onClick={clearSelectedFile} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                    {t('chat.remove', 'Remove')}
                  </button>
                </div>
              )}

              {audioPreviewUrl && (
                <div className="space-y-2">
                  <audio controls src={audioPreviewUrl} className="w-full" />
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{t('chat.voicePreview', 'Voice note ready to send')}</span>
                    <button type="button" onClick={cancelRecording} className="text-slate-500 hover:text-slate-800">
                      {t('chat.discard', 'Discard')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <label htmlFor="chat-input" className="sr-only">{t('chat.messageLabel', 'Message')}</label>
              <input
                id="chat-input"
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('chat.inputPlaceholder', 'Type your message here...')}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || sending}
                className="rounded-full border border-slate-200 bg-slate-50 p-3 text-slate-600 hover:bg-slate-100"
                title={t('chat.attachImage', 'Attach image')}
              >
                ??
              </button>
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={sending}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isRecording ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                {isRecording ? t('chat.stopRecording', 'Stop') : t('chat.recordVoice', 'Record')}
              </button>
              <button
                type="submit"
                disabled={sending || (!newMessage.trim() && !selectedFile && !audioBlob)}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? t('chat.sending', 'Sending...') : t('common.send', 'Send')}
              </button>
            </div>
          </form>

          {isRecording && (
            <div className="mt-3 rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {t('chat.recording', 'Recording voice message')} � {formatDuration(recordingTime)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
