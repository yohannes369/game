import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const emptyForm = { id: null, username: '', password: '', fullName: '', role: 'user', groupId: '' };

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    const [usersRes, groupsRes] = await Promise.all([api.get('/users'), api.get('/groups')]);
    setUsers(usersRes.data.users);
    setGroups(groupsRes.data.groups);
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(u) {
    setForm({ id: u.id, username: u.username, password: '', fullName: u.fullName, role: u.role, groupId: u.groupId || '' });
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
      username: form.username,
      fullName: form.fullName,
      role: form.role,
      groupId: form.groupId ? Number(form.groupId) : null,
    };
    if (form.password) payload.password = form.password;
    if (!form.id) payload.password = form.password;

    try {
      if (form.id) {
        await api.put(`/users/${form.id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('users.confirmDelete'))) return;
    await api.delete(`/users/${id}`);
    await loadData();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('users.title')}</h2>
        <button className="btn btn-primary" onClick={openCreate} type="button">
          {t('users.create')}
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>{t('users.table.username')}</th>
              <th>{t('users.table.fullName')}</th>
              <th>{t('users.table.role')}</th>
              <th>{t('users.table.group')}</th>
              <th>{t('users.table.status')}</th>
              <th>{t('users.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.fullName}</td>
                <td>
                  <span className={`badge badge-${u.role}`}>{t(`roles.${u.role}`)}</span>
                </td>
                <td>{u.groupName || t('users.noGroup')}</td>
                <td>
                  <span className={u.isActive ? 'pill pill-active' : 'pill pill-inactive'}>
                    {u.isActive ? t('users.active') : t('users.inactive')}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)} type="button">
                    {t('users.edit')}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)} type="button">
                    {t('users.delete')}
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
            <h3>{form.id ? t('users.form.editTitle') : t('users.form.title')}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="form">
              <label className="field">
                <span>{t('auth.fullName')}</span>
                <input name="fullName" value={form.fullName} onChange={handleChange} required />
              </label>

              <label className="field">
                <span>{t('auth.username')}</span>
                <input name="username" value={form.username} onChange={handleChange} required disabled={!!form.id} />
              </label>

              <label className="field">
                <span>{form.id ? t('auth.password') : t('auth.password')}</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!form.id}
                  placeholder={form.id ? t('users.form.leaveBlank') : ''}
                />
              </label>

              <label className="field">
                <span>{t('users.form.role')}</span>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="user">{t('roles.user')}</option>
                  <option value="group_leader">{t('roles.group_leader')}</option>
                  <option value="admin">{t('roles.admin')}</option>
                </select>
              </label>

              <label className="field">
                <span>{t('users.form.group')}</span>
                <select name="groupId" value={form.groupId} onChange={handleChange}>
                  <option value="">{t('users.form.noGroup')}</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                  {t('users.form.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('users.form.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
