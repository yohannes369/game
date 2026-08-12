import { useState, useEffect } from 'react';
import { MdNotifications } from 'react-icons/md';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    // TODO: Connect to real notification service
    // This is a placeholder for notification functionality
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'text-gray-300 hover:bg-gray-800'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Notifications"
      >
        <MdNotifications size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div
          className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t('notifications.title')}
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`p-4 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('notifications.empty')}
              </div>
            ) : (
              notifications.map((notif, idx) => (
                <div key={idx} className={`p-4 border-b hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{notif.message}</p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{notif.time}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
