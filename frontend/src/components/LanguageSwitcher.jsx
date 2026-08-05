import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/i18n';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="lang-switcher" role="group" aria-label={t('language.label')}>
      <button
        className={i18n.language === 'en' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => changeLanguage('en')}
        type="button"
      >
        {t('language.en')}
      </button>
      <button
        className={i18n.language === 'am' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => changeLanguage('am')}
        type="button"
      >
        {t('language.am')}
      </button>
    </div>
  );
}
