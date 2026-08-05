import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h2>404</h2>
      <p className="muted">Page not found.</p>
      <Link className="btn btn-primary" to="/dashboard">
        {t('nav.dashboard')}
      </Link>
    </div>
  );
}
