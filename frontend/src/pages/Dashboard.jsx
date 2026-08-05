import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function RoleBadge({ role }) {
  const { t } = useTranslation();
  return <span className={`badge badge-${role}`}>{t(`roles.${role}`)}</span>;
}

function GroupLeaderPanel() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/groups/mine')
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>...</p>;

  if (!data?.group) {
    return <p className="muted">{t('dashboard.noGroup')}</p>;
  }

  return (
    <div className="card">
      <h3>{data.group.name}</h3>
      {data.group.description && <p className="muted">{data.group.description}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>{t('users.table.username')}</th>
            <th>{t('users.table.fullName')}</th>
            <th>{t('users.table.status')}</th>
          </tr>
        </thead>
        <tbody>
          {data.members.map((m) => (
            <tr key={m.id}>
              <td>{m.username}</td>
              <td>{m.fullName}</td>
              <td>
                <span className={m.isActive ? 'pill pill-active' : 'pill pill-inactive'}>
                  {m.isActive ? t('users.active') : t('users.inactive')}
                </span>
              </td>
            </tr>
          ))}
          {data.members.length === 0 && (
            <tr>
              <td colSpan={3} className="muted">
                {t('groups.noMembers')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{t('dashboard.welcome', { name: user.fullName })}</h2>
          <p className="muted">
            {t('dashboard.yourRole')}: <RoleBadge role={user.role} />
          </p>
        </div>
      </div>

      {user.role === 'admin' && (
        <>
          <p className="muted">{t('dashboard.adminSummary')}</p>
          <div className="quick-links">
            <Link to="/users" className="card card-link">
              {t('nav.users')}
            </Link>
            <Link to="/groups" className="card card-link">
              {t('nav.groups')}
            </Link>
          </div>
        </>
      )}

      {user.role === 'group_leader' && (
        <>
          <p className="muted">{t('dashboard.leaderSummary')}</p>
          <GroupLeaderPanel />
        </>
      )}

      {user.role === 'user' && <p className="muted">{t('dashboard.userSummary')}</p>}
    </div>
  );
}
