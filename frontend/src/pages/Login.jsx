


// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';
// import LanguageSwitcher from '../components/LanguageSwitcher';
// import { getErrorMessage } from '../utils/errorMessage';

// export default function Login() {
//   const { t } = useTranslation();
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   function handleChange(e) {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     try {
//       await login(form.username, form.password);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(getErrorMessage(err, t));
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
//       {/* Language Switcher */}
//       <div className="absolute top-4 right-4">
//         <LanguageSwitcher />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center p-4">
//         <div className="w-full max-w-md">
//           {/* Brand Section */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
//               <span className="text-white text-2xl font-bold">🎲</span>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">{t('app.title')}</h1>
//             <p className="text-gray-500 mt-2">{t('app.tagline')}</p>
//           </div>

//           {/* Login Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">{t('auth.loginTitle')}</h2>
//               <p className="text-gray-500 mt-1">{t('auth.welcomeBack', 'Welcome back! Please enter your details.')}</p>
//             </div>

//             {/* Error Alert */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
//                 <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {t('auth.username')}
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                   <input
//                     name="username"
//                     value={form.username}
//                     onChange={handleChange}
//                     autoComplete="username"
//                     required
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
//                     placeholder={t('auth.usernamePlaceholder', 'Enter your username')}
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {t('auth.currentPassword')}
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     autoComplete="current-password"
//                     required
//                     className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
//                     placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     ) : (
//                       <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center">
//                   <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
//                   <span className="ml-2 text-sm text-gray-600">{t('auth.rememberMe', 'Remember me')}</span>
//                 </label>
//                 <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
//                   {t('auth.forgotPassword', 'Forgot password?')}
//                 </Link>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     {t('auth.loggingIn')}
//                   </span>
//                 ) : (
//                   t('auth.loginButton')
//                 )}
//               </button>
//             </form>

//             {/* Register Link */}
//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 {t('auth.noAccount')}{' '}
//                 <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
//                   {t('auth.goToRegister')}
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* Footer */}
//           <p className="text-center text-xs text-gray-400 mt-8">
//             &copy; {new Date().getFullYear()} {t('app.title')}. {t('app.rights', 'All rights reserved.')}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { getErrorMessage } from '../utils/errorMessage';

export default function HomePage() {
  const { t } = useTranslation();
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.username, form.password);
      setShowLoginModal(false);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, t));
    }
  }

  const features = [
    {
      icon: '🎲',
      title: t('home.liveDraws', 'Live Draws'),
      description: t('home.liveDrawsDesc', 'Watch real-time lottery draws as they happen'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '💰',
      title: t('home.bigPrizes', 'Big Prizes'),
      description: t('home.bigPrizesDesc', 'Win massive jackpots and life-changing amounts'),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '🔒',
      title: t('home.secure', '100% Secure'),
      description: t('home.secureDesc', 'Your transactions and data are fully protected'),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '📱',
      title: t('home.mobileFriendly', 'Mobile Friendly'),
      description: t('home.mobileFriendlyDesc', 'Play anytime, anywhere on any device'),
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const stats = [
    { value: '10,000+', label: t('home.activePlayers', 'Active Players') },
    { value: '500,000+', label: t('home.prizesGiven', 'Prizes Given (Birr)') },
    { value: '1,000+', label: t('home.winners', 'Winners') },
    { value: '24/7', label: t('home.support', 'Support') },
  ];

  const recentWinners = [
    { name: 'Abebe K.', amount: '50,000', lottery: 'Daily Jackpot', time: '2 hours ago' },
    { name: 'Sara M.', amount: '25,000', lottery: 'Weekly Draw', time: '5 hours ago' },
    { name: 'Daniel T.', amount: '100,000', lottery: 'Mega Lottery', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">🎲</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{t('app.title')}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">{t('nav.features', 'Features')}</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">{t('nav.howItWorks', 'How It Works')}</a>
              <a href="#winners" className="text-gray-600 hover:text-gray-900 font-medium">{t('nav.winners', 'Winners')}</a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('auth.loginButton')}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
              <a href="#features" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">{t('nav.features', 'Features')}</a>
              <a href="#how-it-works" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">{t('nav.howItWorks', 'How It Works')}</a>
              <a href="#winners" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">{t('nav.winners', 'Winners')}</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('home.heroTitle', 'Win Big with Every Draw!')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in animation-delay-200">
              {t('home.heroSubtitle', 'Join thousands of winners. Your lucky ticket is just a click away.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
              {user ? (
                <Link
                  to="/lotteries"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {t('home.playNow', 'Play Now')} 🎲
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {t('home.getStarted', 'Get Started')} 🚀
                  </button>
                  <Link
                    to="/register"
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
                  >
                    {t('auth.goToRegister', 'Create Account')} ✨
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('home.whyChooseUs', 'Why Choose Us?')}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('home.featuresDesc', 'We offer the best lottery experience with amazing features')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.howItWorks', 'How It Works')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('home.howItWorksDesc', 'Get started in 3 easy steps')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.step1', 'Create Account')}</h3>
              <p className="text-gray-600">{t('home.step1Desc', 'Sign up in seconds and verify your account')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.step2', 'Buy Tickets')}</h3>
              <p className="text-gray-600">{t('home.step2Desc', 'Choose your lucky numbers and purchase tickets')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.step3', 'Win Prizes')}</h3>
              <p className="text-gray-600">{t('home.step3Desc', 'Watch the draw and collect your winnings')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      <section id="winners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('home.recentWinners', 'Recent Winners')}
          </h2>
          <p className="text-gray-600 text-lg">
            {t('home.recentWinnersDesc', 'Join our growing list of winners')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentWinners.map((winner, idx) => (
            <div key={idx} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {winner.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{winner.name}</h3>
                  <p className="text-sm text-gray-500">{winner.time}</p>
                </div>
              </div>
              <div className="border-t border-yellow-200 pt-4">
                <p className="text-sm text-gray-600 mb-1">{winner.lottery}</p>
                <p className="text-2xl font-bold text-green-600">{winner.amount} Birr</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('home.ready', 'Ready to Win Big?')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t('home.readyDesc', 'Join now and get your first ticket!')}
          </p>
          {user ? (
            <Link
              to="/lotteries"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 inline-block shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              {t('home.playNow', 'Play Now')}
            </Link>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 inline-block shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              {t('home.getStarted', 'Get Started Now')}
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{t('app.title')}</h3>
              <p className="text-gray-400">{t('app.tagline')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.quickLinks', 'Quick Links')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/lotteries" className="hover:text-white">{t('nav.lotteries')}</Link></li>
                <li><Link to="/winners" className="hover:text-white">{t('nav.winners')}</Link></li>
                <li><Link to="/register" className="hover:text-white">{t('auth.goToRegister')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.contact', 'Contact')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@lottery.com</li>
                <li>📞 +251 900 000 000</li>
                <li>📍 Addis Ababa, Ethiopia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {t('app.title')}. {t('app.rights', 'All rights reserved.')}</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
                <span className="text-white text-2xl font-bold">🎲</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('auth.loginTitle')}</h2>
              <p className="text-gray-500 mt-1">{t('auth.welcomeBack', 'Welcome back!')}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.username')}</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={t('auth.usernamePlaceholder', 'Enter your username')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.currentPassword')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                    placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('auth.loggingIn')}
                  </span>
                ) : (
                  t('auth.loginButton')
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.noAccount')}{' '}
                <Link to="/register" onClick={() => setShowLoginModal(false)} className="font-medium text-blue-600 hover:text-blue-500">
                  {t('auth.goToRegister')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}