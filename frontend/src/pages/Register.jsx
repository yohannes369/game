import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Register() {
  const { t } = useTranslation();
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '', fullName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form.username, form.password, form.fullName);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1200);
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

        <h2 className="auth-heading">{t('auth.registerTitle')}</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{t('auth.registerSuccess')}</div>}

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>{t('auth.fullName')}</span>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>{t('auth.username')}</span>
            <input name="username" value={form.username} onChange={handleChange} autoComplete="username" required />
            <small>{t('auth.usernameHint')}</small>
          </label>

          <label className="field">
            <span>{t('auth.password')}</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <small>{t('auth.passwordHint')}</small>
          </label>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? t('auth.registering') : t('auth.registerButton')}
          </button>
        </form>

        <p className="auth-switch">
          {t('auth.haveAccount')} <Link to="/login">{t('auth.goToLogin')}</Link>
        </p>
      </div>
    </div>
  );
}
