import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Login() {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page-lang">
        <LanguageSwitcher />
      </div>
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark" aria-hidden="true" />
          <h1>{t('app.title')}</h1>
          <p className="auth-tagline">{t('app.tagline')}</p>
        </div>

        <h2 className="auth-heading">{t('auth.loginTitle')}</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>{t('auth.username')}</span>
            <input name="username" value={form.username} onChange={handleChange} autoComplete="username" required />
          </label>

          <label className="field">
            <span>{t('auth.currentPassword')}</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.loginButton')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.noAccount')} <Link to="/register">{t('auth.goToRegister')}</Link>
        </p>
      </div>
    </div>
  );
}
