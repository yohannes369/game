

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';
// import LanguageSwitcher from '../components/LanguageSwitcher';
// import { getErrorMessage } from '../utils/errorMessage';

// export default function HomePage() {
//   const { t } = useTranslation();
//   const { user, login, loading } = useAuth();
//   const navigate = useNavigate();
  
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   function handleChange(e) {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     try {
//       await login(form.username, form.password);
//       setShowLoginModal(false);
//       navigate('/dashboard');
//     } catch (err) {
//       setError(getErrorMessage(err, t));
//     }
//   }

//   const features = [
//     {
//       icon: '🎲',
//       title: t('home.liveDraws', 'Live Draws'),
//       description: t('home.liveDrawsDesc', 'Watch real-time lottery draws as they happen'),
//       color: 'from-blue-500 to-blue-600',
//     },
//     {
//       icon: '💰',
//       title: t('home.bigPrizes', 'Big Prizes'),
//       description: t('home.bigPrizesDesc', 'Win massive jackpots and life-changing amounts'),
//       color: 'from-green-500 to-green-600',
//     },
//     {
//       icon: '🔒',
//       title: t('home.secure', '100% Secure'),
//       description: t('home.secureDesc', 'Your transactions and data are fully protected'),
//       color: 'from-purple-500 to-purple-600',
//     },
//     {
//       icon: '📱',
//       title: t('home.mobileFriendly', 'Mobile Friendly'),
//       description: t('home.mobileFriendlyDesc', 'Play anytime, anywhere on any device'),
//       color: 'from-orange-500 to-orange-600',
//     },
//   ];

//   const stats = [
//     { value: '10,000+', label: t('home.activePlayers', 'Active Players') },
//     { value: '500,000+', label: t('home.prizesGiven', 'Prizes Given (Birr)') },
//     { value: '1,000+', label: t('home.winners', 'Winners') },
//     { value: '24/7', label: t('home.support', 'Support') },
//   ];

//   const recentWinners = [
//     { name: 'Abebe K.', amount: '50,000', lottery: 'Daily Jackpot', time: '2 hours ago' },
//     { name: 'Sara M.', amount: '25,000', lottery: 'Weekly Draw', time: '5 hours ago' },
//     { name: 'Daniel T.', amount: '100,000', lottery: 'Mega Lottery', time: '1 day ago' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo */}
//             <div className="flex items-center">
//               <Link to="/" className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
//                   <span className="text-white text-xl font-bold">🎲</span>
//                 </div>
//                 <span className="text-xl font-bold text-gray-900">{t('app.title')}</span>
//               </Link>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center gap-6">
//               <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">{t('nav.features', 'Features')}</a>
//               <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">{t('nav.howItWorks', 'How It Works')}</a>
//               <a href="#winners" className="text-gray-600 hover:text-gray-900 font-medium">{t('nav.winners', 'Winners')}</a>
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center gap-3">
//               <LanguageSwitcher />
              
//               {user ? (
//                 <Link
//                   to="/dashboard"
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   {t('nav.dashboard')}
//                 </Link>
//               ) : (
//                 <button
//                   onClick={() => setShowLoginModal(true)}
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
//                 >
//                   {t('auth.loginButton')}
//                 </button>
//               )}

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
//               >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   {isMenuOpen ? (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   ) : (
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                   )}
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {isMenuOpen && (
//             <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
//               <a href="#features" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">{t('nav.features', 'Features')}</a>
//               <a href="#how-it-works" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">{t('nav.howItWorks', 'How It Works')}</a>
//               <a href="#winners" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">{t('nav.winners', 'Winners')}</a>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
//         <div className="absolute inset-0 bg-black opacity-20"></div>
//         <div className="absolute inset-0">
//           <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
//           <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
//           <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
//         </div>
        
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
//               {t('home.heroTitle', 'Win Big with Every Draw!')}
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in animation-delay-200">
//               {t('home.heroSubtitle', 'Join thousands of winners. Your lucky ticket is just a click away.')}
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
//               {user ? (
//                 <Link
//                   to="/lotteries"
//                   className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
//                 >
//                   {t('home.playNow', 'Play Now')} 🎲
//                 </Link>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => setShowLoginModal(true)}
//                     className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
//                   >
//                     {t('home.getStarted', 'Get Started')} 🚀
//                   </button>
//                   <Link
//                     to="/register"
//                     className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
//                   >
//                     {t('auth.goToRegister', 'Create Account')} ✨
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Wave Divider */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
//           </svg>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {stats.map((stat, idx) => (
//             <div key={idx} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
//               <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
//               <div className="text-sm text-gray-600">{stat.label}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             {t('home.whyChooseUs', 'Why Choose Us?')}
//           </h2>
//           <p className="text-gray-600 text-lg">
//             {t('home.featuresDesc', 'We offer the best lottery experience with amazing features')}
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {features.map((feature, idx) => (
//             <div key={idx} className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//               <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//                 <span className="text-2xl">{feature.icon}</span>
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
//               <p className="text-gray-600 text-sm">{feature.description}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="bg-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               {t('home.howItWorks', 'How It Works')}
//             </h2>
//             <p className="text-gray-600 text-lg">
//               {t('home.howItWorksDesc', 'Get started in 3 easy steps')}
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-3xl">1️⃣</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.step1', 'Create Account')}</h3>
//               <p className="text-gray-600">{t('home.step1Desc', 'Sign up in seconds and verify your account')}</p>
//             </div>
//             <div className="text-center">
//               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-3xl">2️⃣</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.step2', 'Buy Tickets')}</h3>
//               <p className="text-gray-600">{t('home.step2Desc', 'Choose your lucky numbers and purchase tickets')}</p>
//             </div>
//             <div className="text-center">
//               <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-3xl">3️⃣</span>
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">{t('home.step3', 'Win Prizes')}</h3>
//               <p className="text-gray-600">{t('home.step3Desc', 'Watch the draw and collect your winnings')}</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Recent Winners */}
//       <section id="winners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//             {t('home.recentWinners', 'Recent Winners')}
//           </h2>
//           <p className="text-gray-600 text-lg">
//             {t('home.recentWinnersDesc', 'Join our growing list of winners')}
//           </p>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {recentWinners.map((winner, idx) => (
//             <div key={idx} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200 shadow-lg">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                   {winner.name.charAt(0)}
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-900">{winner.name}</h3>
//                   <p className="text-sm text-gray-500">{winner.time}</p>
//                 </div>
//               </div>
//               <div className="border-t border-yellow-200 pt-4">
//                 <p className="text-sm text-gray-600 mb-1">{winner.lottery}</p>
//                 <p className="text-2xl font-bold text-green-600">{winner.amount} Birr</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             {t('home.ready', 'Ready to Win Big?')}
//           </h2>
//           <p className="text-xl mb-8 text-blue-100">
//             {t('home.readyDesc', 'Join now and get your first ticket!')}
//           </p>
//           {user ? (
//             <Link
//               to="/lotteries"
//               className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 inline-block shadow-xl hover:shadow-2xl transform hover:scale-105"
//             >
//               {t('home.playNow', 'Play Now')}
//             </Link>
//           ) : (
//             <button
//               onClick={() => setShowLoginModal(true)}
//               className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 inline-block shadow-xl hover:shadow-2xl transform hover:scale-105"
//             >
//               {t('home.getStarted', 'Get Started Now')}
//             </button>
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
//             <div>
//               <h3 className="text-xl font-bold mb-4">{t('app.title')}</h3>
//               <p className="text-gray-400">{t('app.tagline')}</p>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">{t('footer.quickLinks', 'Quick Links')}</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><Link to="/lotteries" className="hover:text-white">{t('nav.lotteries')}</Link></li>
//                 <li><Link to="/winners" className="hover:text-white">{t('nav.winners')}</Link></li>
//                 <li><Link to="/register" className="hover:text-white">{t('auth.goToRegister')}</Link></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold mb-4">{t('footer.contact', 'Contact')}</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li>📧 support@lottery.com</li>
//                 <li>📞 +251 900 000 000</li>
//                 <li>📍 Addis Ababa, Ethiopia</li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
//             <p>&copy; {new Date().getFullYear()} {t('app.title')}. {t('app.rights', 'All rights reserved.')}</p>
//           </div>
//         </div>
//       </footer>

//       {/* Login Modal */}
//       {showLoginModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}></div>
//           <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
//             <button
//               onClick={() => setShowLoginModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <div className="text-center mb-6">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
//                 <span className="text-white text-2xl font-bold">🎲</span>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900">{t('auth.loginTitle')}</h2>
//               <p className="text-gray-500 mt-1">{t('auth.welcomeBack', 'Welcome back!')}</p>
//             </div>

//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
//                 <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.username')}</label>
//                 <input
//                   name="username"
//                   value={form.username}
//                   onChange={handleChange}
//                   autoComplete="username"
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                   placeholder={t('auth.usernamePlaceholder', 'Enter your username')}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.currentPassword')}</label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     autoComplete="current-password"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
//                     placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243" />
//                       </svg>
//                     ) : (
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                     </svg>
//                     {t('auth.loggingIn')}
//                   </span>
//                 ) : (
//                   t('auth.loginButton')
//                 )}
//               </button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-sm text-gray-600">
//                 {t('auth.noAccount')}{' '}
//                 <Link to="/register" onClick={() => setShowLoginModal(false)} className="font-medium text-blue-600 hover:text-blue-500">
//                   {t('auth.goToRegister')}
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(20px, -20px) scale(1.1); }
//           50% { transform: translate(-20px, 20px) scale(0.9); }
//           75% { transform: translate(20px, 20px) scale(1.05); }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.6s ease-out;
//         }
//         .animation-delay-200 {
//           animation-delay: 0.2s;
//         }
//         .animation-delay-400 {
//           animation-delay: 0.4s;
//         }
//         @keyframes slide-up {
//           from { opacity: 0; transform: translateY(20px) scale(0.95); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         .animate-slide-up {
//           animation: slide-up 0.3s ease-out;
//         }
//       `}</style>
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
  const [rememberMe, setRememberMe] = useState(false);

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
      color: 'from-emerald-400 to-green-500',
    },
    {
      icon: '💰',
      title: t('home.bigPrizes', 'Big Prizes'),
      description: t('home.bigPrizesDesc', 'Win massive jackpots and life-changing amounts'),
      color: 'from-teal-400 to-emerald-500',
    },
    {
      icon: '🔒',
      title: t('home.secure', '100% Secure'),
      description: t('home.secureDesc', 'Your transactions and data are fully protected'),
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: '📱',
      title: t('home.mobileFriendly', 'Mobile Friendly'),
      description: t('home.mobileFriendlyDesc', 'Play anytime, anywhere on any device'),
      color: 'from-lime-400 to-green-500',
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-emerald-500/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl shadow-lg shadow-green-100/50 border-b border-green-100 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <span className="text-white text-2xl font-bold">🎲</span>
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">Tolo Dersah</span>
                  <span className="block text-sm font-semibold text-slate-600">Chewata</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="relative text-slate-600 hover:text-emerald-600 font-semibold transition-colors group">
                {t('nav.features', 'Features')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="relative text-slate-600 hover:text-emerald-600 font-semibold transition-colors group">
                {t('nav.howItWorks', 'How It Works')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#winners" className="relative text-slate-600 hover:text-emerald-600 font-semibold transition-colors group">
                {t('nav.winners', 'Winners')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="tel:0997294511" className="flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                0997294511
              </a>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              
              {user ? (
                <Link
                  to="/dashboard"
                  className="relative group bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10">{t('nav.dashboard')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="relative group bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10">{t('auth.loginButton')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
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
            <div className="md:hidden border-t border-slate-200 py-4 space-y-2 animate-slide-up">
              <a href="#features" className="block px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-all">{t('nav.features', 'Features')}</a>
              <a href="#how-it-works" className="block px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-all">{t('nav.howItWorks', 'How It Works')}</a>
              <a href="#winners" className="block px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-all">{t('nav.winners', 'Winners')}</a>
              <a href="tel:0997294511" className="block px-4 py-3 text-emerald-600 font-bold hover:bg-emerald-50 rounded-xl transition-all">📞 0997294511</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 text-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-gradient-to-br from-lime-400 to-green-500 rounded-full mix-blend-screen filter blur-2xl opacity-30 animate-float animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="text-center">
            {/* Glowing Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-2 mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">Tolo Dersah Chewata - 0997294511</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-in tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500 text-transparent bg-clip-text">
                {t('home.heroTitle', 'Win Big with Every Draw!')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-emerald-100 font-light animate-fade-in animation-delay-200 max-w-3xl mx-auto">
              {t('home.heroSubtitle', 'Join thousands of winners. Your lucky ticket is just a click away.')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in animation-delay-400">
              {user ? (
                <Link
                  to="/lotteries"
                  className="group relative bg-gradient-to-r from-emerald-400 to-green-500 text-slate-900 px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {t('home.playNow', 'Play Now')} 
                    <span className="text-2xl group-hover:animate-bounce">🎲</span>
                  </span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="group relative bg-gradient-to-r from-emerald-400 to-green-500 text-slate-900 px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {t('home.getStarted', 'Get Started')} 
                      <span className="text-2xl group-hover:translate-x-2 transition-transform">🚀</span>
                    </span>
                  </button>
                  <Link
                    to="/register"
                    className="group relative bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {t('auth.goToRegister', 'Create Account')} 
                      <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Contact Button */}
            <div className="mt-8 animate-fade-in animation-delay-600">
              <a
                href="tel:0997294511"
                className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors font-semibold"
              >
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-lg">Call Now: 0997294511</span>
              </a>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="group bg-white rounded-2xl shadow-xl shadow-green-100/50 p-8 text-center hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-xl border border-green-50">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-br from-emerald-600 to-green-600 text-transparent bg-clip-text mb-3 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            {t('home.whyChooseUs', 'Why Choose Us?')}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t('home.featuresDesc', 'We offer the best lottery experience with amazing features')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white rounded-3xl shadow-xl shadow-green-100/50 p-8 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:-translate-y-2 border border-green-50 backdrop-blur-xl">
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              {t('home.howItWorks', 'How It Works')}
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {t('home.howItWorksDesc', 'Get started in 3 easy steps')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '1️⃣', title: t('home.step1', 'Create Account'), desc: t('home.step1Desc', 'Sign up in seconds and verify your account'), gradient: 'from-emerald-500 to-green-600' },
              { step: '2️⃣', title: t('home.step2', 'Buy Tickets'), desc: t('home.step2Desc', 'Choose your lucky numbers and purchase tickets'), gradient: 'from-teal-500 to-emerald-600' },
              { step: '3️⃣', title: t('home.step3', 'Win Prizes'), desc: t('home.step3Desc', 'Watch the draw and collect your winnings'), gradient: 'from-lime-500 to-green-600' },
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className={`relative w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <span className="text-4xl">{item.step}</span>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-slate-900 border-2 border-green-200">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      <section id="winners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            {t('home.recentWinners', 'Recent Winners')}
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            {t('home.recentWinnersDesc', 'Join our growing list of winners')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentWinners.map((winner, idx) => (
            <div key={idx} className="group bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8 border border-green-200 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-xl">
                    {winner.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{winner.name}</h3>
                  <p className="text-sm text-slate-500">{winner.time}</p>
                </div>
              </div>
              <div className="border-t border-green-200 pt-6">
                <p className="text-sm text-slate-600 mb-2">{winner.lottery}</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                    {winner.amount}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">Birr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white py-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            {t('home.ready', 'Ready to Win Big?')}
          </h2>
          <p className="text-xl mb-10 text-emerald-100 max-w-2xl mx-auto">
            {t('home.readyDesc', 'Join now and get your first ticket! Call 0997294511')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {user ? (
              <Link
                to="/lotteries"
                className="group bg-white text-emerald-600 px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
              >
                {t('home.playNow', 'Play Now')}
                <span className="text-2xl group-hover:animate-bounce">🎲</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="group bg-white text-emerald-600 px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
              >
                {t('home.getStarted', 'Get Started Now')}
                <span className="text-2xl group-hover:translate-x-2 transition-transform">🚀</span>
              </button>
            )}
            <a
              href="tel:0997294511"
              className="group bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0997294511
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-green-500 text-transparent bg-clip-text">
                Tolo Dersah Chewata
              </h3>
              <p className="text-slate-400">{t('app.tagline', 'Your trusted lottery platform')}</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">{t('footer.quickLinks', 'Quick Links')}</h4>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/lotteries" className="hover:text-emerald-400 transition-colors">{t('nav.lotteries', 'Lotteries')}</Link></li>
                <li><Link to="/winners" className="hover:text-emerald-400 transition-colors">{t('nav.winners', 'Winners')}</Link></li>
                <li><Link to="/register" className="hover:text-emerald-400 transition-colors">{t('auth.goToRegister', 'Register')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">{t('footer.contact', 'Contact')}</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center gap-2">
                  <span>📧</span> support@tolodersah.com
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> 
                  <a href="tel:0997294511" className="hover:text-emerald-400 transition-colors">0997294511</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span> Addis Ababa, Ethiopia
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">{t('footer.followUs', 'Follow Us')}</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors">📱</a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors">💬</a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors">📷</a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} Tolo Dersah Chewata. {t('app.rights', 'All rights reserved.')}</p>
          </div>
        </div>
      </footer>

      {/* AMAZING LOGIN MODAL - Professional Poly Green Design */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-emerald-900/80 to-green-900/80 backdrop-blur-md" onClick={() => setShowLoginModal(false)}></div>
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md animate-slide-up">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-teal-400/30 to-emerald-500/30 rounded-full blur-3xl"></div>
            
            {/* Main Modal */}
            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
              {/* Top Gradient Bar */}
              <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"></div>
              
              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-5 right-5 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-xl transition-all duration-200 z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                      <span className="text-white text-4xl">🎲</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    {t('auth.loginTitle', 'Welcome Back!')}
                  </h2>
                  <p className="text-slate-500 font-medium">
                    {t('auth.welcomeBack', 'Sign in to your account')}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-shake">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username Field */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t('auth.username', 'Username')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 outline-none text-slate-900 font-medium placeholder-slate-400 bg-slate-50 focus:bg-white"
                        placeholder={t('auth.usernamePlaceholder', 'Enter your username')}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {t('auth.currentPassword', 'Password')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                        className="w-full pl-12 pr-12 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 outline-none text-slate-900 font-medium placeholder-slate-400 bg-slate-50 focus:bg-white"
                        placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                        {t('auth.rememberMe', 'Remember me')}
                      </span>
                    </label>
                    <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                      {t('auth.forgotPassword', 'Forgot Password?')}
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white py-4 px-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {loading ? (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {t('auth.loggingIn', 'Signing in...')}
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t('auth.loginButton', 'Sign In')}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500 font-medium">
                      {t('auth.orContinueWith', 'or continue with')}
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-2xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                    <span className="text-xl">📱</span>
                    <span className="text-sm font-semibold">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-2xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
                    <span className="text-xl">💬</span>
                    <span className="text-sm font-semibold">Telegram</span>
                  </button>
                </div>

                {/* Register Link */}
                <div className="mt-8 text-center">
                  <p className="text-slate-600 font-medium">
                    {t('auth.noAccount', "Don't have an account?")}{' '}
                    <Link 
                      to="/register" 
                      onClick={() => setShowLoginModal(false)} 
                      className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
                    >
                      {t('auth.goToRegister', 'Create Account')}
                    </Link>
                  </p>
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                  <a 
                    href="tel:0997294511" 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Need help? Call 0997294511
                  </a>
                </div>
              </div>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
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
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}