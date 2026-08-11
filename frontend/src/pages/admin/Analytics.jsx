import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

function BarChart({ title, data, labelKey, valueKey }) {
  const { t } = useTranslation();
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1);

  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="bar-chart">
        {data.map((d, i) => (
          <div className="bar-col" key={i}>
            <div
              className="bar"
              style={{ height: `${(Number(d[valueKey]) / max) * 100}%` }}
              title={String(d[valueKey])}
            />
            <span className="bar-label">{d[labelKey]}</span>
          </div>
        ))}
      </div>
      <p className="muted" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
        {t('analytics.maxValue')}: {max}
      </p>
    </div>
  );
}

function SettingsEditor() {
  const { t } = useTranslation();
  const [key, setKey] = useState('referral_enabled');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      const { data } = await api.get(`/admin/settings/${key}`);
      setValue(JSON.stringify(data.value ?? data.setting ?? data, null, 2));
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      let parsed = value;
      try {
        parsed = JSON.parse(value);
      } catch {
        // keep as raw string if not valid JSON
      }
      await api.put(`/admin/settings/${key}`, { value: parsed });
      setSuccess(t('analytics.settingsSaved'));
    } catch (err) {
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>{t('analytics.settings')}</h3>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={save} className="form">
        <label className="field">
          <span>{t('analytics.settingKey')}</span>
          <div className="actions">
            <input value={key} onChange={(e) => setKey(e.target.value)} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={load} disabled={busy}>
              {t('analytics.loadSetting')}
            </button>
          </div>
        </label>
        <label className="field">
          <span>{t('analytics.settingValue')}</span>
          <textarea
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ font: 'inherit', padding: '0.6rem 0.7rem', borderRadius: 8, border: '1px solid var(--border)' }}
          />
        </label>
        <div className="modal-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {t('analytics.saveSetting')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Analytics() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/analytics')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || t('errors.generic')))
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <div className="page">
      <div className="page-header">
        <h2>{t('analytics.title')}</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">{t('common.loading')}</p>
      ) : (
        <>
          {data?.totals && (
            <div className="stat-grid" style={{ marginBottom: '1.25rem' }}>
              {Object.entries(data.totals).map(([k, v]) => (
                <div className="stat-card" key={k}>
                  <div className="stat-label">{t(`analytics.totals.${k}`, k)}</div>
                  <div className="stat-value">{v}</div>
                </div>
              ))}
            </div>
          )}

          {data?.daily && (
            <div style={{ marginBottom: '1.25rem' }}>
              <BarChart title={t('analytics.daily')} data={data.daily} labelKey="date" valueKey="value" />
            </div>
          )}

          {data?.monthly && (
            <div style={{ marginBottom: '1.25rem' }}>
              <BarChart title={t('analytics.monthly')} data={data.monthly} labelKey="month" valueKey="value" />
            </div>
          )}

          <SettingsEditor />
        </>
      )}
    </div>
  );
}
