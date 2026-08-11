import { useTranslation } from 'react-i18next';

export default function StatusPill({ status }) {
  const { t } = useTranslation();
  if (!status) return null;
  return (
    <span className={`status status-${status}`}>
      {t(`status.${status}`, status)}
    </span>
  );
}
