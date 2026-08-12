import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

function BarChart({ title, data, labelKey, valueKey }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return null;
  }

  const values = data.map(
    (item) => Number(item[valueKey]) || 0
  );

  const max = Math.max(...values, 1);

  return (
    <div className="card">
      <h3>{title}</h3>

      <div className="bar-chart">
        {data.map((item, index) => {
          const value = Number(item[valueKey]) || 0;

          return (
            <div
              className="bar-col"
              key={`${item[labelKey]}-${index}`}
            >
              <div
                className="bar"
                style={{
                  height: `${(value / max) * 100}%`,
                }}
                title={String(value)}
              />

              <span className="bar-label">
                {item[labelKey]}
              </span>
            </div>
          );
        })}
      </div>

      <p
        className="muted"
        style={{
          marginTop: '0.5rem',
          marginBottom: 0,
        }}
      >
        {t('analytics.maxValue', 'Maximum value')}: {max}
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
    if (!key.trim()) {
      setError(
        t(
          'analytics.settingKeyRequired',
          'Setting key is required.'
        )
      );
      return;
    }

    setError('');
    setSuccess('');
    setBusy(true);

    try {
      const { data } = await api.get(
        `/admin/settings/${key.trim()}`
      );

      const settingValue =
        data?.value ??
        data?.setting ??
        data;

      setValue(
        typeof settingValue === 'string'
          ? settingValue
          : JSON.stringify(
              settingValue,
              null,
              2
            )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t(
            'errors.generic',
            'Something went wrong.'
          )
      );
    } finally {
      setBusy(false);
    }
  }

  async function save(event) {
    event.preventDefault();

    if (!key.trim()) {
      setError(
        t(
          'analytics.settingKeyRequired',
          'Setting key is required.'
        )
      );
      return;
    }

    setError('');
    setSuccess('');
    setBusy(true);

    try {
      let parsedValue = value;

      try {
        parsedValue = JSON.parse(value);
      } catch {
        // Keep the value as a normal string
        // when it is not valid JSON.
      }

      await api.put(
        `/admin/settings/${key.trim()}`,
        {
          value: parsedValue,
        }
      );

      setSuccess(
        t(
          'analytics.settingsSaved',
          'Setting saved successfully.'
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t(
            'errors.generic',
            'Something went wrong.'
          )
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>
        {t(
          'analytics.settings',
          'Settings'
        )}
      </h3>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <form
        onSubmit={save}
        className="form"
      >
        {/* Setting Key */}
        <label className="field">
          <span>
            {t(
              'analytics.settingKey',
              'Setting Key'
            )}
          </span>

          <div className="actions">
            <input
              type="text"
              value={key}
              onChange={(event) =>
                setKey(event.target.value)
              }
              placeholder="referral_enabled"
              disabled={busy}
            />

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={load}
              disabled={busy}
            >
              {busy
                ? t(
                    'common.loading',
                    'Loading...'
                  )
                : t(
                    'analytics.loadSetting',
                    'Load Setting'
                  )}
            </button>
          </div>
        </label>

        {/* Setting Value */}
        <label className="field">
          <span>
            {t(
              'analytics.settingValue',
              'Setting Value'
            )}
          </span>

          <textarea
            rows={6}
            value={value}
            onChange={(event) =>
              setValue(event.target.value)
            }
            placeholder='true'
            disabled={busy}
            style={{
              font: 'inherit',
              padding: '0.6rem 0.7rem',
              borderRadius: 8,
              border:
                '1px solid var(--border)',
              width: '100%',
              resize: 'vertical',
            }}
          />
        </label>

        {/* Save */}
        <div className="modal-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
          >
            {busy
              ? t(
                  'common.saving',
                  'Saving...'
                )
              : t(
                  'analytics.saveSetting',
                  'Save Setting'
                )}
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
    let mounted = true;

    async function loadAnalytics() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(
          '/admin/analytics'
        );

        if (mounted) {
          setData(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              t(
                'errors.generic',
                'Something went wrong.'
              )
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, [t]);

  return (
    <div className="page">
      {/* Page Header */}
      <div className="page-header">
        <h2>
          {t(
            'analytics.title',
            'Analytics'
          )}
        </h2>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <p className="muted">
          {t(
            'common.loading',
            'Loading...'
          )}
        </p>
      ) : (
        <>
          {/* ==================================================
              TOTALS
          ================================================== */}

          {data?.totals &&
            Object.keys(data.totals).length > 0 && (
              <div
                className="stat-grid"
                style={{
                  marginBottom: '1.25rem',
                }}
              >
                {Object.entries(
                  data.totals
                ).map(([key, value]) => (
                  <div
                    className="stat-card"
                    key={key}
                  >
                    <div className="stat-label">
                      {t(
                        `analytics.totals.${key}`,
                        key
                      )}
                    </div>

                    <div className="stat-value">
                      {value ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* ==================================================
              DAILY ANALYTICS
          ================================================== */}

          {Array.isArray(data?.daily) &&
            data.daily.length > 0 && (
              <div
                style={{
                  marginBottom: '1.25rem',
                }}
              >
                <BarChart
                  title={t(
                    'analytics.daily',
                    'Daily'
                  )}
                  data={data.daily}
                  labelKey="date"
                  valueKey="value"
                />
              </div>
            )}

          {/* ==================================================
              MONTHLY ANALYTICS
          ================================================== */}

          {Array.isArray(data?.monthly) &&
            data.monthly.length > 0 && (
              <div
                style={{
                  marginBottom: '1.25rem',
                }}
              >
                <BarChart
                  title={t(
                    'analytics.monthly',
                    'Monthly'
                  )}
                  data={data.monthly}
                  labelKey="month"
                  valueKey="value"
                />
              </div>
            )}

          {/* ==================================================
              SETTINGS
          ================================================== */}

          <SettingsEditor />
        </>
      )}
    </div>
  );
}