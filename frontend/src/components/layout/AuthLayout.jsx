import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';
import LanguageSwitcher from '../common/LanguageSwitcher';

function AuthLayout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} flex flex-col`}>
        {/* Header with Theme Toggle */}
        <header className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                <span className="text-white font-bold">L</span>
              </div>
              <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Lottery
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-orange-500 hover:bg-gray-200'
                }`}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AuthLayout;
