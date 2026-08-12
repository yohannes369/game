import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { FiMenu, FiX, FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { MdNotifications } from 'react-icons/md';
import NotificationBell from '../common/NotificationBell';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // Navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { label: t('navbar.dashboard'), path: '/user/dashboard' },
      { label: t('navbar.lotteries'), path: '/lotteries' },
      { label: t('navbar.challenges'), path: '/user/challenges' },
      { label: t('navbar.payments'), path: '/user/payments' },
    ];

    if (user.role === 'admin') {
      return [
        { label: t('navbar.dashboard'), path: '/admin/dashboard' },
        { label: t('navbar.lotteries'), path: '/admin/lotteries' },
        { label: t('navbar.payments'), path: '/admin/payments' },
        { label: t('navbar.challenges'), path: '/admin/challenges' },
        { label: t('navbar.users'), path: '/admin/users' },
        { label: t('navbar.withdrawals'), path: '/admin/withdrawals' },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-40 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
              <span className="text-white font-bold">L</span>
            </div>
            <span className={`font-bold text-lg hidden sm:inline ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Lottery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Theme Toggle */}
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

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <FiX size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
              ) : (
                <FiMenu size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
              )}
            </button>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-gray-300 dark:border-gray-700">
              <div className="text-right">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.fullName || user?.username}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.role || 'User'}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}>
                {user?.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* User Info Mobile */}
              <div className={`px-3 py-2 ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <FiUser size={16} />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {user?.fullName || user?.username}
                  </span>
                </div>
                <Link
                  to="/user/profile"
                  className={`block text-sm py-1 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('navbar.profile')}
                </Link>
              </div>

              {/* Logout Mobile */}
              <button
                onClick={handleLogout}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors ${
                  theme === 'dark'
                    ? 'text-red-400 hover:bg-red-900/20'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <FiLogOut size={16} />
                <span>{t('navbar.logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
