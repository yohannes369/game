import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function diffParts(targetDate) {
  const ms = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const totalSeconds = Math.floor(ms / 1000);
  return {
    d: Math.floor(totalSeconds / 86400),
    h: Math.floor((totalSeconds % 86400) / 3600),
    m: Math.floor((totalSeconds % 3600) / 60),
    s: totalSeconds % 60,
    done: ms <= 0,
  };
}

export default function Countdown({ target }) {
  const { t } = useTranslation();
  const [parts, setParts] = useState(() => diffParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(diffParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!target) return null;

  if (parts.done) {
    return <p className="muted">{t('lottery.drawPending')}</p>;
  }

  return (
    <div className="countdown">
      <span>{parts.d}{t('lottery.d')}</span>
      <span>{parts.h}{t('lottery.h')}</span>
      <span>{parts.m}{t('lottery.m')}</span>
      <span>{parts.s}{t('lottery.s')}</span>
    </div>
  );
}
