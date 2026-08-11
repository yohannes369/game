// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { changeLanguage } from '../i18n/i18n';

// export default function LanguageSwitcher() {
//   const { i18n, t } = useTranslation();
//   const [isOpen, setIsOpen] = useState(false);

//   const languages = [
//     { code: 'en', label: t('language.en'), flag: '🇺🇸', native: 'English' },
//     { code: 'am', label: t('language.am'), flag: '🇪🇹', native: 'አማርኛ' },
//   ];

//   const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700"
//         aria-label={t('language.label')}
//         title={t('language.label')}
//       >
//         <span className="text-lg">{currentLang.flag}</span>
//         <span className="hidden sm:inline">{currentLang.label}</span>
//         <svg
//           className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//         </svg>
//       </button>

//       {isOpen && (
//         <>
//           <div
//             className="fixed inset-0 z-10"
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
//             {languages.map((lang) => (
//               <button
//                 key={lang.code}
//                 onClick={() => {
//                   changeLanguage(lang.code);
//                   setIsOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
//                   i18n.language === lang.code
//                     ? 'bg-blue-50 text-blue-700 font-medium'
//                     : 'text-gray-700'
//                 }`}
//                 type="button"
//               >
//                 <span className="text-xl">{lang.flag}</span>
//                 <div className="flex flex-col items-start">
//                   <span className="font-medium">{lang.label}</span>
//                   <span className="text-xs text-gray-500">{lang.native}</span>
//                 </div>
//                 {i18n.language === lang.code && (
//                   <svg className="w-5 h-5 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                   </svg>
//                 )}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n/i18n';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: t('language.en'), flag: '🇺🇸', native: 'English' },
    { code: 'am', label: t('language.am'), flag: '🇪🇹', native: 'አማርኛ' },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700"
        aria-label={t('language.label')}
        title={t('language.label')}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.label}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                  i18n.language === lang.code
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700'
                }`}
                type="button"
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{lang.label}</span>
                  <span className="text-xs text-gray-500">{lang.native}</span>
                </div>
                {i18n.language === lang.code && (
                  <svg className="w-5 h-5 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}