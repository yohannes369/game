import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme } = useTheme();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`p-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'text-gray-300 hover:bg-gray-800'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Language"
      >
        <FiGlobe size={20} />
      </button>

      {showDropdown && (
        <div
          className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                i18n.language === lang.code
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-900'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
