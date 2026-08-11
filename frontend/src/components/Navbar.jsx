
// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';
// import LanguageSwitcher from './LanguageSwitcher';
// import NotificationBell from './NotificationBell';

// const PAYMENT_STAFF = ['admin', 'payment_admin'];
// const FINANCE_STAFF = ['admin', 'finance_admin'];

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);

//   async function handleLogout() {
//     await logout();
//     navigate('/login');
//   }

//   const isActive = (path) => {
//     return location.pathname === path || location.pathname.startsWith(path + '/');
//   };

//   const navLinks = [
//     { path: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
//     { path: '/lotteries', label: t('nav.lotteries'), icon: '🎲' },
//     { path: '/challenges/new', label: t('nav.challenges', 'Challenges'), icon: '⚔️' },
//     { path: '/winners', label: t('nav.winners'), icon: '🏆' },
//     { path: '/withdrawals', label: t('nav.withdrawals'), icon: '💰' },
//     ...(PAYMENT_STAFF.includes(user?.role) ? [{ path: '/payments', label: t('nav.payments'), icon: '💳' }] : []),
//     ...(user?.role === 'admin' ? [
//       { path: '/admin/challenges/review', label: t('nav.challengeReview', 'Challenge Review'), icon: '🛡️' },
//       { path: '/admin/paid-users', label: t('nav.paidUsers'), icon: '✅' },
//       { path: '/users', label: t('nav.users'), icon: '👥' },
//       { path: '/groups', label: t('nav.groups'), icon: '🏘️' },
//       { path: '/admin/analytics', label: t('nav.analytics'), icon: '📈' },
//     ] : []),
//     ...(FINANCE_STAFF.includes(user?.role) ? [
//       { path: '/admin/challenges/finance-report', label: t('nav.financeReport', 'Finance Report'), icon: '🧾' },
//     ] : []),
//   ];

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/dashboard" className="flex items-center gap-3 group">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
//                 <span className="text-white text-xl font-bold">🎲</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900 hidden sm:block">
//                 {t('app.title')}
//               </span>
//             </Link>

//             {/* Desktop Navigation */}
//             {user && (
//               <nav className="hidden lg:flex items-center ml-10 space-x-1">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
//                       isActive(link.path)
//                         ? 'bg-blue-50 text-blue-700'
//                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                     }`}
//                   >
//                     <span>{link.icon}</span>
//                     <span>{link.label}</span>
//                   </Link>
//                 ))}
//               </nav>
//             )}
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-3">
//             <LanguageSwitcher />

//             {user && (
//               <>
//                 <NotificationBell />

//                 {/* Profile Dropdown */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                       {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
//                     </div>
//                     <div className="hidden md:block text-left">
//                       <p className="text-sm font-medium text-gray-700">{user.fullName}</p>
//                       <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
//                     </div>
//                     <svg
//                       className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>

//                   {/* Dropdown Menu */}
//                   {isProfileOpen && (
//                     <>
//                       <div
//                         className="fixed inset-0 z-10"
//                         onClick={() => setIsProfileOpen(false)}
//                       />
//                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
//                         <div className="px-4 py-2 border-b border-gray-100">
//                           <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
//                           <p className="text-xs text-gray-500">{user.email}</p>
//                         </div>
//                         <Link
//                           to="/profile"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           onClick={() => setIsProfileOpen(false)}
//                         >
//                           {t('nav.profile', 'Profile')}
//                         </Link>
//                         <Link
//                           to="/change-password"
//                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           onClick={() => setIsProfileOpen(false)}
//                         >
//                           {t('nav.changePassword', 'Change Password')}
//                         </Link>
//                         <button
//                           onClick={() => {
//                             setIsProfileOpen(false);
//                             handleLogout();
//                           }}
//                           className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                           </svg>
//                           {t('nav.logout')}
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Mobile Menu Button */}
//                 <button
//                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                   className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//                 >
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     {isMobileMenuOpen ? (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     ) : (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                     )}
//                   </svg>
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {user && isMobileMenuOpen && (
//           <nav className="lg:hidden border-t border-gray-200 py-4 space-y-1">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 onClick={() => setIsMobileMenuOpen(false)}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
//                   isActive(link.path)
//                     ? 'bg-blue-50 text-blue-700'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                 }`}
//               >
//                 <span className="text-lg">{link.icon}</span>
//                 <span>{link.label}</span>
//               </Link>
//             ))}

//             {/* Mobile Logout */}
//             <button
//               onClick={() => {
//                 setIsMobileMenuOpen(false);
//                 handleLogout();
//               }}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//               </svg>
//               {t('nav.logout')}
//             </button>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// // }


// import { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';
// import LanguageSwitcher from './LanguageSwitcher';
// import NotificationBell from './NotificationBell';

// const PAYMENT_STAFF = ['admin', 'payment_admin'];
// const FINANCE_STAFF = ['admin', 'finance_admin'];

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const profileRef = useRef(null);

//   // Handle scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close profile dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setIsProfileOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location.pathname]);

//   async function handleLogout() {
//     await logout();
//     navigate('/login');
//   }

//   const isActive = (path) => {
//     return location.pathname === path || location.pathname.startsWith(path + '/');
//   };

//   const navLinks = [
//     { path: '/dashboard', label: t('nav.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//     { path: '/lotteries', label: t('nav.lotteries'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
//     { path: '/challenges/new', label: t('nav.challenges', 'Challenges'), icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
//     { path: '/winners', label: t('nav.winners'), icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
//     { path: '/withdrawals', label: t('nav.withdrawals'), icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
//     ...(PAYMENT_STAFF.includes(user?.role) ? [{ path: '/payments', label: t('nav.payments'), icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' }] : []),
//     ...(user?.role === 'admin' ? [
//       { path: '/admin/challenges/review', label: t('nav.challengeReview', 'Challenge Review'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
//       { path: '/admin/paid-users', label: t('nav.paidUsers'), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
//       { path: '/users', label: t('nav.users'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
//       { path: '/groups', label: t('nav.groups'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
//       { path: '/admin/analytics', label: t('nav.analytics'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
//     ] : []),
//     ...(FINANCE_STAFF.includes(user?.role) ? [
//       { path: '/admin/challenges/finance-report', label: t('nav.financeReport', 'Finance Report'), icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
//     ] : []),
//   ];

//   return (
//     <header 
//       className={`sticky top-0 z-50 transition-all duration-300 ${
//         scrolled 
//           ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
//           : 'bg-white border-b border-gray-100'
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16 lg:h-20">
//           {/* Logo Section */}
//           <div className="flex items-center gap-4">
//             <Link 
//               to="/dashboard" 
//               className="flex items-center gap-3 group relative"
//               aria-label="Home"
//             >
//               {/* Animated Logo Container */}
//               <div className="relative w-10 h-10 lg:w-12 lg:h-12">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl rotate-45 transform group-hover:rotate-90 transition-transform duration-500 shadow-lg group-hover:shadow-2xl"></div>
//                 <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
//                   <span className="text-xl lg:text-2xl transform group-hover:scale-110 transition-transform duration-300">
//                     🎲
//                   </span>
//                 </div>
//               </div>
              
//               {/* Brand Name */}
//               <div className="hidden sm:block">
//                 <span className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//                   {t('app.title')}
//                 </span>
//               </div>
//             </Link>

//             {/* Desktop Navigation */}
//             {user && (
//               <nav className="hidden lg:flex items-center ml-8 gap-1">
//                 {navLinks.map((link) => (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     className={`group relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
//                       isActive(link.path)
//                         ? 'text-white'
//                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                     }`}
//                   >
//                     {/* Active Background */}
//                     {isActive(link.path) && (
//                       <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md"></div>
//                     )}
                    
//                     {/* Icon */}
//                     <svg 
//                       className={`w-4 h-4 relative z-10 transition-transform group-hover:scale-110 ${
//                         isActive(link.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
//                       }`} 
//                       fill="none" 
//                       stroke="currentColor" 
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
//                     </svg>
                    
//                     {/* Label */}
//                     <span className="relative z-10">{link.label}</span>
                    
//                     {/* Hover Effect */}
//                     {!isActive(link.path) && (
//                       <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                     )}
//                   </Link>
//                 ))}
//               </nav>
//             )}
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-2 sm:gap-3">
//             <LanguageSwitcher />

//             {user && (
//               <>
//                 <NotificationBell />

//                 {/* Profile Dropdown */}
//                 <div className="relative" ref={profileRef}>
//                   <button
//                     onClick={() => setIsProfileOpen(!isProfileOpen)}
//                     className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-200"
//                     aria-expanded={isProfileOpen}
//                     aria-haspopup="true"
//                   >
//                     {/* Avatar */}
//                     <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
//                       {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
//                     </div>
                    
//                     {/* User Info (Desktop) */}
//                     <div className="hidden md:block text-left">
//                       <p className="text-sm font-semibold text-gray-800 leading-tight">
//                         {user.fullName}
//                       </p>
//                       <p className="text-xs text-gray-500 capitalize">
//                         {user.role.replace('_', ' ')}
//                       </p>
//                     </div>
                    
//                     {/* Chevron */}
//                     <svg
//                       className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
//                         isProfileOpen ? 'rotate-180' : ''
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>

//                   {/* Dropdown Menu */}
//                   {isProfileOpen && (
//                     <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20 animate-slideDown overflow-hidden">
//                       {/* User Info */}
//                       <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
//                             {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-bold text-gray-900 truncate">
//                               {user.fullName}
//                             </p>
//                             <p className="text-xs text-gray-600 truncate">
//                               {user.email}
//                             </p>
//                             <span className="inline-block mt-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-indigo-600 shadow-sm">
//                               {user.role.replace('_', ' ')}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Menu Items */}
//                       <div className="py-2">
//                         <Link
//                           to="/profile"
//                           className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors group"
//                           onClick={() => setIsProfileOpen(false)}
//                         >
//                           <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                           </svg>
//                           {t('nav.profile', 'Profile')}
//                         </Link>
                        
//                         <Link
//                           to="/change-password"
//                           className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors group"
//                           onClick={() => setIsProfileOpen(false)}
//                         >
//                           <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                           </svg>
//                           {t('nav.changePassword', 'Change Password')}
//                         </Link>

//                         <div className="border-t border-gray-100 my-2"></div>

//                         <button
//                           onClick={() => {
//                             setIsProfileOpen(false);
//                             handleLogout();
//                           }}
//                           className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
//                         >
//                           <svg className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                           </svg>
//                           {t('nav.logout')}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Mobile Menu Button */}
//                 <button
//                   onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                   className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 relative"
//                   aria-label="Toggle menu"
//                 >
//                   <div className="w-5 h-5 relative">
//                     <span className={`block absolute h-0.5 w-5 bg-current transform transition-all duration-300 ${
//                       isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
//                     }`}></span>
//                     <span className={`block absolute h-0.5 w-5 bg-current transform transition-all duration-300 ${
//                       isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
//                     }`}></span>
//                     <span className={`block absolute h-0.5 w-5 bg-current transform transition-all duration-300 ${
//                       isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
//                     }`}></span>
//                   </div>
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {user && (
//           <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
//             isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
//           }`}>
//             <nav className="border-t border-gray-100 py-3 space-y-1 bg-gradient-to-b from-white to-gray-50">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
//                     isActive(link.path)
//                       ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
//                       : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                   }`}
//                 >
//                   <svg 
//                     className={`w-5 h-5 ${isActive(link.path) ? 'text-white' : 'text-gray-400'}`} 
//                     fill="none" 
//                     stroke="currentColor" 
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
//                   </svg>
//                   <span>{link.label}</span>
//                 </Link>
//               ))}

//               {/* Mobile Profile Links */}
//               <div className="border-t border-gray-200 pt-3 mt-3 px-4">
//                 <Link
//                   to="/profile"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="flex items-center gap-3 py-3 text-sm text-gray-600 hover:text-gray-900"
//                 >
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   {t('nav.profile', 'Profile')}
//                 </Link>
//                 <Link
//                   to="/change-password"
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="flex items-center gap-3 py-3 text-sm text-gray-600 hover:text-gray-900"
//                 >
//                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                   </svg>
//                   {t('nav.changePassword', 'Change Password')}
//                 </Link>
//               </div>

//               {/* Mobile Logout */}
//               <button
//                 onClick={() => {
//                   setIsMobileMenuOpen(false);
//                   handleLogout();
//                 }}
//                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 {t('nav.logout')}
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideDown {
//           animation: slideDown 0.2s ease-out;
//         }
//       `}</style>
//     </header>
//   );
// }

// import { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';
// import LanguageSwitcher from './LanguageSwitcher';
// import NotificationBell from './NotificationBell';

// const PAYMENT_STAFF = ['admin', 'payment_admin'];
// const FINANCE_STAFF = ['admin', 'finance_admin'];

// // ── Nav link definitions ──────────────────────────────────────────────────────
// // Each entry: { path, labelKey, defaultLabel?, icon, roles? }
// // roles: if set, only users whose role is in the array see this link.

// function buildNavLinks(user, t) {
//   return [
//     {
//       path: '/dashboard',
//       label: t('nav.dashboard'),
//       icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
//     },
//     {
//       path: '/lotteries',
//       label: t('nav.lotteries'),
//       icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
//     },
//     // ── NEW: My Orders (visible to all logged-in users) ─────────────────────
//     {
//       path: '/my-orders',
//       label: t('nav.myOrders', 'My Orders'),
//       icon: 'M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1 1 1 0 1 0 0 2 1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a1 1 0 0 1-1-1 1 1 0 1 0 0-2 1 1 0 0 1-1-1V6Z',
//     },
//     {
//       path: '/challenges/new',
//       label: t('nav.challenges', 'Challenges'),
//       icon: 'M13 10V3L4 14h7v7l9-11h-7z',
//     },
//     {
//       path: '/winners',
//       label: t('nav.winners'),
//       icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
//     },
//     {
//       path: '/withdrawals',
//       label: t('nav.withdrawals'),
//       icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
//     },
//     ...(PAYMENT_STAFF.includes(user?.role)
//       ? [{
//           path: '/payments',
//           label: t('nav.payments'),
//           icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
//         }]
//       : []),
//     ...(user?.role === 'admin'
//       ? [
//           { path: '/admin/challenges/review', label: t('nav.challengeReview', 'Challenge Review'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
//           { path: '/admin/paid-users',         label: t('nav.paidUsers'),                          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
//           { path: '/users',                    label: t('nav.users'),                              icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
//           { path: '/groups',                   label: t('nav.groups'),                             icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
//           { path: '/admin/analytics',          label: t('nav.analytics'),                          icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
//         ]
//       : []),
//     ...(FINANCE_STAFF.includes(user?.role)
//       ? [{
//           path: '/admin/challenges/finance-report',
//           label: t('nav.financeReport', 'Finance Report'),
//           icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
//         }]
//       : []),
//   ];
// }

// // ── Component ─────────────────────────────────────────────────────────────────

// export default function Navbar() {
//   const { user, logout }  = useAuth();
//   const { t }             = useTranslation();
//   const navigate          = useNavigate();
//   const location          = useLocation();
//   const profileRef        = useRef(null);

//   const [mobileOpen,   setMobileOpen]   = useState(false);
//   const [profileOpen,  setProfileOpen]  = useState(false);
//   const [scrolled,     setScrolled]     = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   useEffect(() => {
//     const onOutside = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
//     document.addEventListener('mousedown', onOutside);
//     return () => document.removeEventListener('mousedown', onOutside);
//   }, []);

//   useEffect(() => { setMobileOpen(false); }, [location.pathname]);

//   async function handleLogout() { await logout(); navigate('/login'); }

//   const isActive  = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
//   const navLinks  = user ? buildNavLinks(user, t) : [];

//   return (
//     <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white border-b border-gray-100'}`}>
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between lg:h-20">

//           {/* Logo + Desktop Nav */}
//           <div className="flex items-center gap-4">
//             <Link to="/dashboard" className="group relative flex items-center gap-3">
//               <div className="relative h-10 w-10 lg:h-12 lg:w-12">
//                 <div className="absolute inset-0 rotate-45 transform rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg transition-transform duration-500 group-hover:rotate-90 group-hover:shadow-2xl" />
//                 <div className="absolute inset-1 flex items-center justify-center rounded-xl bg-white">
//                   <span className="text-xl transition-transform duration-300 group-hover:scale-110 lg:text-2xl">🎲</span>
//                 </div>
//               </div>
//               <span className="hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-xl font-extrabold text-transparent sm:block lg:text-2xl">
//                 {t('app.title')}
//               </span>
//             </Link>

//             {user && (
//               <nav className="ml-8 hidden items-center gap-1 lg:flex">
//                 {navLinks.map((link) => (
//                   <NavLink key={link.path} link={link} active={isActive(link.path)} />
//                 ))}
//               </nav>
//             )}
//           </div>

//           {/* Right section */}
//           <div className="flex items-center gap-2 sm:gap-3">
//             <LanguageSwitcher />

//             {user && (
//               <>
//                 <NotificationBell />

//                 {/* Profile dropdown */}
//                 <div className="relative" ref={profileRef}>
//                   <button
//                     onClick={() => setProfileOpen(!profileOpen)}
//                     className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-all hover:border-gray-200 hover:bg-gray-50 sm:p-2"
//                   >
//                     <Avatar name={user.fullName} size="sm" />
//                     <div className="hidden text-left md:block">
//                       <p className="text-sm font-semibold leading-tight text-gray-800">{user.fullName}</p>
//                       <p className="text-xs capitalize text-gray-500">{user.role.replace('_', ' ')}</p>
//                     </div>
//                     <svg className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </button>

//                   {profileOpen && (
//                     <div className="animate-slideDown absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl">
//                       <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar name={user.fullName} size="lg" />
//                           <div className="min-w-0 flex-1">
//                             <p className="truncate text-sm font-bold text-gray-900">{user.fullName}</p>
//                             <p className="truncate text-xs text-gray-600">{user.email}</p>
//                             <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-indigo-600 shadow-sm">
//                               {user.role.replace('_', ' ')}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="py-2">
//                         <DropdownLink to="/profile"          icon="person"   label={t('nav.profile', 'Profile')}                  onClick={() => setProfileOpen(false)} />
//                         <DropdownLink to="/my-orders"        icon="ticket"   label={t('nav.myOrders', 'My Orders')}               onClick={() => setProfileOpen(false)} />
//                         <DropdownLink to="/change-password"  icon="key"      label={t('nav.changePassword', 'Change Password')}   onClick={() => setProfileOpen(false)} />
//                         <div className="my-2 border-t border-gray-100" />
//                         <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="group flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 transition-colors hover:bg-red-50">
//                           <LogoutIcon />
//                           {t('nav.logout')}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Mobile hamburger */}
//                 <button
//                   onClick={() => setMobileOpen(!mobileOpen)}
//                   className="relative rounded-xl p-2.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 lg:hidden"
//                 >
//                   <div className="relative h-5 w-5">
//                     <span className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
//                     <span className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
//                     <span className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
//                   </div>
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {user && (
//           <div className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
//             <nav className="space-y-1 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 py-3">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   onClick={() => setMobileOpen(false)}
//                   className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
//                     isActive(link.path)
//                       ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
//                       : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                   }`}
//                 >
//                   <svg className={`h-5 w-5 ${isActive(link.path) ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
//                   </svg>
//                   {link.label}
//                 </Link>
//               ))}

//               <div className="mt-3 border-t border-gray-200 px-4 pt-3">
//                 <Link to="/profile"         onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-sm text-gray-600 hover:text-gray-900"><PersonIcon />{t('nav.profile', 'Profile')}</Link>
//                 <Link to="/change-password" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-sm text-gray-600 hover:text-gray-900"><KeyIcon />{t('nav.changePassword', 'Change Password')}</Link>
//               </div>

//               <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
//                 <LogoutIcon />
//                 {t('nav.logout')}
//               </button>
//             </nav>
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes slideDown { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
//         .animate-slideDown { animation: slideDown 0.2s ease-out; }
//       `}</style>
//     </header>
//   );
// }

// // ── Sub-components ────────────────────────────────────────────────────────────

// function NavLink({ link, active }) {
//   return (
//     <Link
//       to={link.path}
//       className={`group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${active ? 'text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
//     >
//       {active && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md" />}
//       <svg className={`relative z-10 h-4 w-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
//       </svg>
//       <span className="relative z-10">{link.label}</span>
//       {!active && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 transition-opacity group-hover:opacity-100" />}
//     </Link>
//   );
// }

// function Avatar({ name, size = 'sm' }) {
//   const cls = size === 'lg' ? 'h-12 w-12 text-lg' : 'h-8 w-8 sm:h-9 sm:h-9 text-sm';
//   return (
//     <div className={`${cls} flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-bold text-white shadow-md`}>
//       {name?.charAt(0)?.toUpperCase() || 'U'}
//     </div>
//   );
// }

// function DropdownLink({ to, label, onClick, icon }) {
//   const icons = {
//     person: <PersonIcon />,
//     ticket: <TicketIcon />,
//     key:    <KeyIcon />,
//   };
//   return (
//     <Link to={to} onClick={onClick} className="group flex items-center gap-3 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-indigo-50">
//       <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">{icons[icon]}</span>
//       {label}
//     </Link>
//   );
// }

// // ── SVG icon helpers ──────────────────────────────────────────────────────────
// const I = ({ d }) => (
//   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
//   </svg>
// );

// const PersonIcon  = () => <I d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
// const KeyIcon     = () => <I d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />;
// const LogoutIcon  = () => <I d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />;
// const TicketIcon  = () => <I d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a1 1 0 01-1 1 1 1 0 100 2 1 1 0 011 1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a1 1 0 011-1 1 1 0 100-2 1 1 0 01-1-1V6z" />;

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';

const PAYMENT_STAFF = ['admin', 'payment_admin'];
const FINANCE_STAFF = ['admin', 'finance_admin'];

// ── Nav link definitions ──────────────────────────────────────────────────────
// Each entry: { path, labelKey, defaultLabel?, icon, roles? }
// roles: if set, only users whose role is in the array see this link.

function buildNavLinks(user, t) {
  return [
    {
      path: '/dashboard',
      label: t('nav.dashboard'),
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      path: '/lotteries',
      label: t('nav.lotteries'),
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    // My Orders — visible to all logged-in users; shows their own payments,
    // ticket numbers once approved, and the rejection reason if declined.
    {
      path: '/my-orders',
      label: t('nav.myOrders', 'My Orders'),
      icon: 'M2 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1 1 1 0 1 0 0 2 1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a1 1 0 0 1-1-1 1 1 0 1 0 0-2 1 1 0 0 1-1-1V6Z',
    },
    {
      path: '/challenges/new',
      label: t('nav.challenges', 'Challenges'),
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
      path: '/winners',
      label: t('nav.winners'),
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    },
    {
      path: '/withdrawals',
      label: t('nav.withdrawals'),
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    },
    // Payments — admin & payment_admin only. This page now also doubles as
    // payment history: use the pending/approved/rejected/all tabs on it.
    ...(PAYMENT_STAFF.includes(user?.role)
      ? [{
          path: '/payments',
          label: t('nav.payments'),
          icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        }]
      : []),
    ...(user?.role === 'admin'
      ? [
          { path: '/admin/challenges/review', label: t('nav.challengeReview', 'Challenge Review'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { path: '/admin/paid-users',         label: t('nav.paidUsers'),                          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
          { path: '/users',                    label: t('nav.users'),                              icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
          { path: '/groups',                   label: t('nav.groups'),                             icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
          { path: '/admin/analytics',          label: t('nav.analytics'),                          icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        ]
      : []),
    ...(FINANCE_STAFF.includes(user?.role)
      ? [{
          path: '/admin/challenges/finance-report',
          label: t('nav.financeReport', 'Finance Report'),
          icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        }]
      : []),
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Navbar() {
  const { user, logout }  = useAuth();
  const { t }             = useTranslation();
  const navigate          = useNavigate();
  const location          = useLocation();
  const profileRef        = useRef(null);

  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  async function handleLogout() { await logout(); navigate('/login'); }

  const isActive  = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const navLinks  = user ? buildNavLinks(user, t) : [];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white border-b border-gray-100'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">

          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="group relative flex items-center gap-3">
              <div className="relative h-10 w-10 lg:h-12 lg:w-12">
                <div className="absolute inset-0 rotate-45 transform rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg transition-transform duration-500 group-hover:rotate-90 group-hover:shadow-2xl" />
                <div className="absolute inset-1 flex items-center justify-center rounded-xl bg-white">
                  <span className="text-xl transition-transform duration-300 group-hover:scale-110 lg:text-2xl">🎲</span>
                </div>
              </div>
              <span className="hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-xl font-extrabold text-transparent sm:block lg:text-2xl">
                {t('app.title')}
              </span>
            </Link>

            {user && (
              <nav className="ml-8 hidden items-center gap-1 lg:flex">
                {navLinks.map((link) => (
                  <NavLink key={link.path} link={link} active={isActive(link.path)} />
                ))}
              </nav>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            {user && (
              <>
                <NotificationBell />

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-xl border border-transparent p-1.5 transition-all hover:border-gray-200 hover:bg-gray-50 sm:p-2"
                  >
                    <Avatar name={user.fullName} size="sm" />
                    <div className="hidden text-left md:block">
                      <p className="text-sm font-semibold leading-tight text-gray-800">{user.fullName}</p>
                      <p className="text-xs capitalize text-gray-500">{user.role.replace('_', ' ')}</p>
                    </div>
                    <svg className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="animate-slideDown absolute right-0 z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl">
                      <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.fullName} size="lg" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-gray-900">{user.fullName}</p>
                            <p className="truncate text-xs text-gray-600">{user.email}</p>
                            <span className="mt-1 inline-block rounded-full bg-white px-2 py-0.5 text-xs font-medium text-indigo-600 shadow-sm">
                              {user.role.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <DropdownLink to="/profile"          icon="person"   label={t('nav.profile', 'Profile')}                  onClick={() => setProfileOpen(false)} />
                        <DropdownLink to="/my-orders"        icon="ticket"   label={t('nav.myOrders', 'My Orders')}               onClick={() => setProfileOpen(false)} />
                        <DropdownLink to="/change-password"  icon="key"      label={t('nav.changePassword', 'Change Password')}   onClick={() => setProfileOpen(false)} />
                        <div className="my-2 border-t border-gray-100" />
                        <button onClick={() => { setProfileOpen(false); handleLogout(); }} className="group flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 transition-colors hover:bg-red-50">
                          <LogoutIcon />
                          {t('nav.logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="relative rounded-xl p-2.5 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 lg:hidden"
                >
                  <div className="relative h-5 w-5">
                    <span className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
                    <span className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`absolute block h-0.5 w-5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && (
          <div className={`overflow-hidden transition-all duration-300 lg:hidden ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
            <nav className="space-y-1 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className={`h-5 w-5 ${isActive(link.path) ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 border-t border-gray-200 px-4 pt-3">
                <Link to="/profile"         onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-sm text-gray-600 hover:text-gray-900"><PersonIcon />{t('nav.profile', 'Profile')}</Link>
                <Link to="/change-password" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 py-3 text-sm text-gray-600 hover:text-gray-900"><KeyIcon />{t('nav.changePassword', 'Change Password')}</Link>
              </div>

              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                <LogoutIcon />
                {t('nav.logout')}
              </button>
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </header>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NavLink({ link, active }) {
  return (
    <Link
      to={link.path}
      className={`group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${active ? 'text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
    >
      {active && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md" />}
      <svg className={`relative z-10 h-4 w-4 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
      </svg>
      <span className="relative z-10">{link.label}</span>
      {!active && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 transition-opacity group-hover:opacity-100" />}
    </Link>
  );
}

function Avatar({ name, size = 'sm' }) {
  const cls = size === 'lg' ? 'h-12 w-12 text-lg' : 'h-8 w-8 sm:h-9 sm:h-9 text-sm';
  return (
    <div className={`${cls} flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-bold text-white shadow-md`}>
      {name?.charAt(0)?.toUpperCase() || 'U'}
    </div>
  );
}

function DropdownLink({ to, label, onClick, icon }) {
  const icons = {
    person: <PersonIcon />,
    ticket: <TicketIcon />,
    key:    <KeyIcon />,
  };
  return (
    <Link to={to} onClick={onClick} className="group flex items-center gap-3 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-indigo-50">
      <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">{icons[icon]}</span>
      {label}
    </Link>
  );
}

// ── SVG icon helpers ──────────────────────────────────────────────────────────
const I = ({ d }) => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={d} />
  </svg>
);

const PersonIcon  = () => <I d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
const KeyIcon     = () => <I d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />;
const LogoutIcon  = () => <I d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />;
const TicketIcon  = () => <I d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a1 1 0 01-1 1 1 1 0 100 2 1 1 0 011 1v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a1 1 0 011-1 1 1 0 100-2 1 1 0 01-1-1V6z" />;