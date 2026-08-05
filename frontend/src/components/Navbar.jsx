import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          {t('app.title')}
        </Link>

        {user && (
          <nav className="nav-links">
            <Link to="/dashboard">{t('nav.dashboard')}</Link>
            {user.role === 'admin' && <Link to="/users">{t('nav.users')}</Link>}
            {user.role === 'admin' && <Link to="/groups">{t('nav.groups')}</Link>}
          </nav>
        )}

        <div className="navbar-right">
          <LanguageSwitcher />
          {user && (
            <button className="btn btn-ghost" onClick={handleLogout} type="button">
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
