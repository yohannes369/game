import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const emptyForm = { id: null, name: '', description: '', leaderId: '' };

export default function Groups() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [viewing, setViewing] = useState(null); // { group, members }

  async function loadData() {
    const [groupsRes, usersRes] = await Promise.all([api.get('/groups'), api.get('/users')]);
    setGroups(groupsRes.data.groups);
    setUsers(usersRes.data.users);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(g) {
    setForm({ id: g.id, name: g.name, description: g.description || '', leaderId: g.leaderId || '' });
    setError('');
    setShowForm(true);
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      description: form.description,
      leaderId: form.leaderId ? Number(form.leaderId) : null,
    };
    try {
      if (form.id) {
        await api.put(`/groups/${form.id}`, payload);
      } else {
        await api.post('/groups', payload);
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('groups.confirmDelete'))) return;
    await api.delete(`/groups/${id}`);
    await loadData();
  }

  async function viewMembers(id) {
    const { data } = await api.get(`/groups/${id}/members`);
    setViewing(data);
  }

  // Candidates for "leader": current group_leaders, plus plain users (promoting them assigns the role)
  const leaderCandidates = users.filter((u) => u.role !== 'admin');

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('groups.title')}</h2>
        <button className="btn btn-primary" onClick={openCreate} type="button">
          {t('groups.create')}
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>{t('groups.table.name')}</th>
              <th>{t('groups.table.description')}</th>
              <th>{t('groups.table.leader')}</th>
              <th>{t('groups.table.members')}</th>
              <th>{t('groups.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td className="muted">{g.description || '—'}</td>
                <td>{g.leaderName || t('groups.noLeader')}</td>
                <td>{g.memberCount}</td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => viewMembers(g.id)} type="button">
                    {t('groups.viewMembers')}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(g)} type="button">
                    {t('groups.edit')}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(g.id)} type="button">
                    {t('groups.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{form.id ? t('groups.form.editTitle') : t('groups.form.title')}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="form">
              <label className="field">
                <span>{t('groups.form.name')}</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label className="field">
                <span>{t('groups.form.description')}</span>
                <input name="description" value={form.description} onChange={handleChange} />
              </label>

              <label className="field">
                <span>{t('groups.form.leader')}</span>
                <select name="leaderId" value={form.leaderId} onChange={handleChange}>
                  <option value="">{t('groups.form.noLeader')}</option>
                  {leaderCandidates.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.username})
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                  {t('groups.form.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('groups.form.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div className="modal-backdrop" onClick={() => setViewing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('groups.membersOf', { name: viewing.group.name })}</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>{t('users.table.username')}</th>
                  <th>{t('users.table.fullName')}</th>
                  <th>{t('users.table.role')}</th>
                </tr>
              </thead>
              <tbody>
                {viewing.members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.username}</td>
                    <td>{m.fullName}</td>
                    <td>
                      <span className={`badge badge-${m.role}`}>{t(`roles.${m.role}`)}</span>
                    </td>
                  </tr>
                ))}
                {viewing.members.length === 0 && (
                  <tr>
                    <td colSpan={3} className="muted">
                      {t('groups.noMembers')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setViewing(null)} type="button">
                {t('groups.form.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
