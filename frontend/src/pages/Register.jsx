

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';
// import LanguageSwitcher from '../components/LanguageSwitcher';
// import { getErrorMessage } from '../utils/errorMessage';

// export default function Register() {
//   const { t } = useTranslation();
//   const { register, loading } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: '',
//     password: '',
//     fullName: '',
//     phoneNumber: '',
//     location: ''
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [focusedField, setFocusedField] = useState('');

//   function handleChange(e) {
//     setForm((f) => ({
//       ...f,
//       [e.target.name]: e.target.value
//     }));
//     if (error) setError('');
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');

//     // Basic validation
//     if (form.password.length < 6) {
//       setError(t('auth.passwordTooShort', 'Password must be at least 6 characters'));
//       return;
//     }

//     try {
//       await register(
//         form.username,
//         form.password,
//         form.fullName,
//         form.phoneNumber,
//         form.location
//       );

//       setSuccess(true);

//       setTimeout(() => navigate('/login'), 1500);

//     } catch (err) {
//       setError(getErrorMessage(err, t));
//     }
//   }

//   const inputClasses = (fieldName) => `
//     w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300
//     bg-white text-gray-900 placeholder-gray-400
//     ${focusedField === fieldName 
//       ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg' 
//       : error && !form[fieldName] 
//         ? 'border-red-300 hover:border-red-400' 
//         : 'border-gray-200 hover:border-indigo-300 focus:border-indigo-500'
//     }
//     outline-none text-sm
//   `;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
//       {/* Language Switcher */}
//       <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
//         <LanguageSwitcher />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
//         <div className="w-full max-w-lg">
//           {/* Animated Success Overlay */}
//           {success && (
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
//               <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center max-w-md mx-4 animate-scaleUp">
//                 <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
//                   <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                   {t('auth.registerSuccess', 'Registration Successful!')}
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   {t('auth.redirectingToLogin', 'Redirecting to login...')}
//                 </p>
//                 <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                   <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full animate-loadingBar"></div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Brand Section */}
//           <div className="text-center mb-8">
//             <Link to="/" className="inline-block group">
//               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3">
//                 <span className="text-3xl sm:text-4xl">🎲</span>
//               </div>
//             </Link>
//             <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//               {t('app.title')}
//             </h1>
//             <p className="mt-2 text-gray-500 text-sm sm:text-base">
//               {t('app.tagline', 'Your Gateway to Exciting Lotteries')}
//             </p>
//           </div>

//           {/* Registration Card */}
//           <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 lg:p-10 border border-gray-100">
//             <div className="mb-8">
//               <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//                 {t('auth.registerTitle', 'Create Account')}
//               </h2>
//               <p className="mt-2 text-gray-500 text-sm">
//                 {t('auth.registerSubtitle', 'Join us and start playing today')}
//               </p>
//             </div>

//             {/* Error Alert */}
//             {error && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
//                 <div className="flex items-start gap-3">
//                   <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <div>
//                     <p className="text-sm font-medium text-red-800">{error}</p>
//                     <p className="text-xs text-red-600 mt-1">
//                       {t('auth.tryAgain', 'Please check your information and try again')}
//                     </p>
//                   </div>
//                   <button 
//                     onClick={() => setError('')}
//                     className="ml-auto text-red-400 hover:text-red-600"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Full Name Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   {t('auth.fullName', 'Full Name')}
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="text"
//                     name="fullName"
//                     value={form.fullName}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('fullName')}
//                     onBlur={() => setFocusedField('')}
//                     className={`${inputClasses('fullName')} pl-10`}
//                     placeholder={t('auth.fullNamePlaceholder', 'John Doe')}
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Phone Number Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   {t('auth.phoneNumber', 'Phone Number')}
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={form.phoneNumber}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('phoneNumber')}
//                     onBlur={() => setFocusedField('')}
//                     className={`${inputClasses('phoneNumber')} pl-10`}
//                     placeholder="+251 911 234 567"
//                     required
//                   />
//                 </div>
//                 <p className="mt-1 text-xs text-gray-400">
//                   {t('auth.phoneHint', 'Include country code for verification')}
//                 </p>
//               </div>

//               {/* Location Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   {t('auth.location', 'Location')}
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="text"
//                     name="location"
//                     value={form.location}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('location')}
//                     onBlur={() => setFocusedField('')}
//                     className={`${inputClasses('location')} pl-10`}
//                     placeholder={t('auth.locationPlaceholder', 'Bahir Dar, Ethiopia')}
//                   />
//                 </div>
//               </div>

//               {/* Divider */}
//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-400 font-medium">
//                     {t('auth.accountDetails', 'Account Details')}
//                   </span>
//                 </div>
//               </div>

//               {/* Username Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   {t('auth.username', 'Username')}
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="text"
//                     name="username"
//                     value={form.username}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('username')}
//                     onBlur={() => setFocusedField('')}
//                     className={`${inputClasses('username')} pl-10`}
//                     placeholder={t('auth.usernamePlaceholder', 'your_username')}
//                     autoComplete="username"
//                     required
//                   />
//                 </div>
//                 <p className="mt-1 text-xs text-gray-400">
//                   {t('auth.usernameHint', 'Choose a unique username for your account')}
//                 </p>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   {t('auth.password', 'Password')}
//                   <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     onFocus={() => setFocusedField('password')}
//                     onBlur={() => setFocusedField('')}
//                     className={`${inputClasses('password')} pl-10 pr-12`}
//                     placeholder={t('auth.passwordPlaceholder', '••••••••')}
//                     autoComplete="new-password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                       </svg>
//                     ) : (
//                       <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     )}
//                   </button>
//                 </div>
//                 {/* Password Strength Indicator */}
//                 {form.password && (
//                   <div className="mt-2">
//                     <div className="flex gap-1">
//                       {[1, 2, 3, 4].map((level) => (
//                         <div
//                           key={level}
//                           className={`h-1 flex-1 rounded-full transition-all duration-300 ${
//                             form.password.length >= level * 3
//                               ? level <= 2
//                                 ? 'bg-red-400'
//                                 : level === 3
//                                 ? 'bg-yellow-400'
//                                 : 'bg-green-400'
//                               : 'bg-gray-200'
//                           }`}
//                         ></div>
//                       ))}
//                     </div>
//                     <p className="mt-1 text-xs text-gray-400">
//                       {form.password.length < 6
//                         ? t('auth.passwordWeak', 'Password is too weak')
//                         : form.password.length < 8
//                         ? t('auth.passwordFair', 'Password is fair')
//                         : t('auth.passwordStrong', 'Password is strong')}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     {t('auth.registering', 'Creating Account...')}
//                   </span>
//                 ) : (
//                   <span className="flex items-center justify-center gap-2">
//                     {t('auth.registerButton', 'Create Account')}
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </span>
//                 )}
//               </button>
//             </form>

//             {/* Footer */}
//             <div className="mt-8 text-center">
//               <p className="text-sm text-gray-600">
//                 {t('auth.haveAccount', 'Already have an account?')}{' '}
//                 <Link
//                   to="/login"
//                   className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
//                 >
//                   {t('auth.goToLogin', 'Sign in')}
//                 </Link>
//               </p>
//             </div>
//           </div>

//           {/* Terms */}
//           <p className="mt-6 text-center text-xs text-gray-400">
//             {t('auth.termsText', 'By creating an account, you agree to our')}{' '}
//             <Link to="/terms" className="text-indigo-600 hover:text-indigo-700">
//               {t('auth.termsOfService', 'Terms of Service')}
//             </Link>{' '}
//             {t('auth.and', 'and')}{' '}
//             <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700">
//               {t('auth.privacyPolicy', 'Privacy Policy')}
//             </Link>
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes scaleUp {
//           from { 
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to { 
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         @keyframes loadingBar {
//           from { width: 0%; }
//           to { width: 100%; }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//         .animate-scaleUp {
//           animation: scaleUp 0.3s ease-out;
//         }
//         .animate-loadingBar {
//           animation: loadingBar 1.5s ease-in-out;
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//         .animate-bounce {
//           animation: bounce 0.5s ease-in-out infinite;
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//       `}</style>
//     </div>
//   );
// }

// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useAuth } from '../context/AuthContext';
// import LanguageSwitcher from '../components/LanguageSwitcher';
// import { getErrorMessage } from '../utils/errorMessage';

// export default function Register() {
//   const { t } = useTranslation();
//   const { register, loading } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     username: '',
//     password: '',
//     fullName: '',
//     phoneNumber: '',
//     location: ''
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [focusedField, setFocusedField] = useState('');

//   function handleChange(e) {
//     setForm((f) => ({
//       ...f,
//       [e.target.name]: e.target.value
//     }));
//     if (error) setError('');
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');

//     if (form.password.length < 6) {
//       setError(t('auth.passwordTooShort', 'Password must be at least 6 characters'));
//       return;
//     }

//     try {
//       await register(
//         form.username,
//         form.password,
//         form.fullName,
//         form.phoneNumber,
//         form.location
//       );

//       setSuccess(true);
//       setTimeout(() => navigate('/login'), 1500);
//     } catch (err) {
//       setError(getErrorMessage(err, t));
//     }
//   }

//   const inputClasses = (fieldName) => `
//     w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300
//     bg-white/95 backdrop-blur-sm text-gray-800 placeholder-gray-400
//     ${focusedField === fieldName 
//       ? 'border-emerald-400 ring-4 ring-emerald-400/20 shadow-lg shadow-emerald-400/20 scale-[1.02]' 
//       : error && !form[fieldName] 
//         ? 'border-red-300 hover:border-red-400' 
//         : 'border-emerald-100 hover:border-emerald-300 focus:border-emerald-400'
//     }
//     outline-none text-sm font-medium
//   `;

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex flex-col">
      
//       {/* Animated Polygonal Green Graphics Background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
//         {/* Large Glowing Orbs */}
//         <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-emerald-400/30 via-green-500/20 to-teal-400/30 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-lime-400/20 via-emerald-500/30 to-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-teal-400/10 via-green-500/15 to-emerald-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

//         {/* SVG Polygon Mesh Grid */}
//         <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <pattern id="hexGrid" x="0" y="0" width="80" height="120" patternUnits="userSpaceOnUse">
//               <path d="M40 0L80 20L80 60L40 80L0 60L0 20Z" fill="none" stroke="#10b981" strokeWidth="1.5"/>
//               <path d="M40 80L80 100L80 140L40 160L0 140L0 100Z" fill="none" stroke="#059669" strokeWidth="1"/>
//             </pattern>
//             <pattern id="triGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
//               <path d="M50 0L100 50L50 100L0 50Z" fill="none" stroke="#34d399" strokeWidth="0.8"/>
//               <path d="M0 0L50 50L0 100" fill="none" stroke="#6ee7b7" strokeWidth="0.5"/>
//               <path d="M100 0L50 50L100 100" fill="none" stroke="#6ee7b7" strokeWidth="0.5"/>
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#hexGrid)"/>
//           <rect width="100%" height="100%" fill="url(#triGrid)" opacity="0.5"/>
//         </svg>

//         {/* Animated Polygon Shapes */}
//         <div className="absolute top-20 right-20 w-64 h-64 animate-float">
//           <svg viewBox="0 0 200 200" className="w-full h-full">
//             <polygon 
//               points="100,10 190,50 190,130 100,190 10,130 10,50" 
//               fill="none" 
//               stroke="#34d399" 
//               strokeWidth="2"
//               className="animate-dash"
//             />
//             <polygon 
//               points="100,30 170,60 170,120 100,170 30,120 30,60" 
//               fill="rgba(16,185,129,0.1)" 
//               stroke="#10b981" 
//               strokeWidth="1.5"
//             />
//           </svg>
//         </div>

//         <div className="absolute bottom-20 left-20 w-72 h-72 animate-float-delayed">
//           <svg viewBox="0 0 200 200" className="w-full h-full">
//             <polygon 
//               points="100,10 180,60 160,140 60,160 20,100 40,40" 
//               fill="none" 
//               stroke="#059669" 
//               strokeWidth="2"
//               className="animate-dash-reverse"
//             />
//             <polygon 
//               points="100,30 160,65 145,130 65,145 35,105 50,50" 
//               fill="rgba(5,150,105,0.1)" 
//               stroke="#047857" 
//               strokeWidth="1.5"
//             />
//           </svg>
//         </div>

//         <div className="absolute top-1/3 left-1/4 w-48 h-48 animate-float-slow">
//           <svg viewBox="0 0 200 200" className="w-full h-full">
//             <polygon 
//               points="100,20 190,70 190,150 100,190 10,150 10,70" 
//               fill="none" 
//               stroke="#6ee7b7" 
//               strokeWidth="2.5"
//               className="animate-dash"
//             />
//           </svg>
//         </div>

//         {/* Floating Geometric Diamonds */}
//         <div className="absolute top-1/4 right-1/3 w-24 h-24 animate-spin-slow">
//           <svg viewBox="0 0 100 100" className="w-full h-full">
//             <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="#34d399" strokeWidth="1.5" transform="rotate(45 50 50)"/>
//             <circle cx="50" cy="50" r="25" fill="rgba(52,211,153,0.1)" stroke="#10b981" strokeWidth="1"/>
//           </svg>
//         </div>

//         {/* Small Floating Triangles */}
//         {[...Array(6)].map((_, i) => (
//           <div 
//             key={i}
//             className="absolute animate-float-random"
//             style={{
//               top: `${Math.random() * 80}%`,
//               left: `${Math.random() * 80}%`,
//               animationDelay: `${i * 0.5}s`,
//               width: '30px',
//               height: '30px'
//             }}
//           >
//             <svg viewBox="0 0 100 100" className="w-full h-full">
//               <polygon 
//                 points="50,5 95,95 5,95" 
//                 fill="rgba(16,185,129,0.15)" 
//                 stroke="#34d399" 
//                 strokeWidth="1"
//               />
//             </svg>
//           </div>
//         ))}

//         {/* Geometric Lines */}
//         <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
//           <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#10b981" strokeWidth="1"/>
//           <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#059669" strokeWidth="1"/>
//           <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#34d399" strokeWidth="1"/>
//           <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#047857" strokeWidth="1"/>
//         </svg>
//       </div>

//       {/* Language Switcher */}
//       <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
//         <LanguageSwitcher />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
//         <div className="w-full max-w-lg">
          
//           {/* Success Overlay */}
//           {success && (
//             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
//               <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 sm:p-12 shadow-2xl text-center max-w-md mx-4 border-2 border-emerald-200 animate-scaleUp">
//                 <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-400/30">
//                   <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <h3 className="text-2xl font-bold text-emerald-900 mb-2">
//                   {t('auth.registerSuccess', 'Registration Successful!')}
//                 </h3>
//                 <p className="text-emerald-700 mb-6">
//                   {t('auth.redirectingToLogin', 'Redirecting to login...')}
//                 </p>
//                 <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
//                   <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-full rounded-full animate-loadingBar"></div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Brand Section */}
//           <div className="text-center mb-8">
//             <Link to="/" className="inline-block group">
//               <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
//                 <svg viewBox="0 0 200 200" className="w-full h-full">
//                   <defs>
//                     <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#34d399" />
//                       <stop offset="50%" stopColor="#10b981" />
//                       <stop offset="100%" stopColor="#059669" />
//                     </linearGradient>
//                   </defs>
//                   <polygon 
//                     points="100,10 190,55 190,145 100,190 10,145 10,55" 
//                     fill="url(#logoGrad)" 
//                     className="animate-polygon-glow"
//                   />
//                   <polygon 
//                     points="100,30 170,65 170,135 100,170 30,135 30,65" 
//                     fill="rgba(255,255,255,0.2)" 
//                     stroke="white" 
//                     strokeWidth="2"
//                   />
//                   <text x="100" y="110" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">P</text>
//                 </svg>
//                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-xl animate-pulse"></div>
//               </div>
//             </Link>
//             <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold">
//               <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent">
//                 {t('app.title')}
//               </span>
//             </h1>
//             <p className="mt-2 text-emerald-200/80 text-sm sm:text-base font-medium">
//               {t('app.tagline', 'Your Gateway to Exciting Lotteries')}
//             </p>
//           </div>

//           {/* Registration Card */}
//           <div className="relative backdrop-blur-xl bg-white/95 rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-900/30 p-6 sm:p-8 lg:p-10 border-2 border-emerald-200">
            
//             {/* Card Geometric Decorations */}
//             <div className="absolute -top-4 -left-4 w-16 h-16">
//               <svg viewBox="0 0 100 100" className="w-full h-full">
//                 <polygon points="50,5 95,95 5,95" fill="#34d399" opacity="0.3"/>
//                 <polygon points="50,15 85,85 15,85" fill="#10b981" opacity="0.2"/>
//               </svg>
//             </div>
//             <div className="absolute -bottom-4 -right-4 w-16 h-16">
//               <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-180">
//                 <polygon points="50,5 95,95 5,95" fill="#059669" opacity="0.3"/>
//                 <polygon points="50,15 85,85 15,85" fill="#047857" opacity="0.2"/>
//               </svg>
//             </div>
//             <div className="absolute top-1/2 -left-2 w-8 h-8">
//               <svg viewBox="0 0 100 100" className="w-full h-full">
//                 <circle cx="50" cy="50" r="30" fill="none" stroke="#34d399" strokeWidth="3" opacity="0.4"/>
//                 <circle cx="50" cy="50" r="15" fill="#10b981" opacity="0.3"/>
//               </svg>
//             </div>
//             <div className="absolute top-1/2 -right-2 w-8 h-8">
//               <svg viewBox="0 0 100 100" className="w-full h-full">
//                 <rect x="20" y="20" width="60" height="60" fill="none" stroke="#059669" strokeWidth="3" opacity="0.4" transform="rotate(45 50 50)"/>
//               </svg>
//             </div>
            
//             <div className="relative">
//               <div className="mb-8">
//                 <div className="flex items-center gap-3 mb-2">
//                   <svg viewBox="0 0 100 100" className="w-8 h-8">
//                     <polygon points="50,10 90,40 90,80 50,100 10,80 10,40" fill="#10b981" opacity="0.8"/>
//                     <polygon points="50,20 80,42 80,78 50,90 20,78 20,42" fill="white" opacity="0.5"/>
//                   </svg>
//                   <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900">
//                     {t('auth.registerTitle', 'Create Account')}
//                   </h2>
//                 </div>
//                 <p className="mt-2 text-emerald-700 text-sm font-medium">
//                   {t('auth.registerSubtitle', 'Join us and start playing today')}
//                 </p>
//               </div>

//               {/* Error Alert */}
//               {error && (
//                 <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl animate-shake">
//                   <div className="flex items-start gap-3">
//                     <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <div className="flex-1">
//                       <p className="text-sm font-semibold text-red-800">{error}</p>
//                       <p className="text-xs text-red-600 mt-1">
//                         {t('auth.tryAgain', 'Please check your information and try again')}
//                       </p>
//                     </div>
//                     <button 
//                       onClick={() => setError('')}
//                       className="text-red-400 hover:text-red-600 transition-colors"
//                     >
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {/* Full Name Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-emerald-800 mb-2">
//                     {t('auth.fullName', 'Full Name')}
//                     <span className="text-emerald-500 ml-1">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={form.fullName}
//                       onChange={handleChange}
//                       onFocus={() => setFocusedField('fullName')}
//                       onBlur={() => setFocusedField('')}
//                       className={`${inputClasses('fullName')} pl-10`}
//                       placeholder={t('auth.fullNamePlaceholder', 'John Doe')}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Phone Number Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-emerald-800 mb-2">
//                     {t('auth.phoneNumber', 'Phone Number')}
//                     <span className="text-emerald-500 ml-1">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={form.phoneNumber}
//                       onChange={handleChange}
//                       onFocus={() => setFocusedField('phoneNumber')}
//                       onBlur={() => setFocusedField('')}
//                       className={`${inputClasses('phoneNumber')} pl-10`}
//                       placeholder="+251 911 234 567"
//                       required
//                     />
//                   </div>
//                   <p className="mt-1 text-xs text-emerald-600 font-medium">
//                     {t('auth.phoneHint', 'Include country code for verification')}
//                   </p>
//                 </div>

//                 {/* Location Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-emerald-800 mb-2">
//                     {t('auth.location', 'Location')}
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="text"
//                       name="location"
//                       value={form.location}
//                       onChange={handleChange}
//                       onFocus={() => setFocusedField('location')}
//                       onBlur={() => setFocusedField('')}
//                       className={`${inputClasses('location')} pl-10`}
//                       placeholder={t('auth.locationPlaceholder', 'Bahir Dar, Ethiopia')}
//                     />
//                   </div>
//                 </div>

//                 {/* Divider with Polygon */}
//                 <div className="relative my-6">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t-2 border-emerald-200"></div>
//                   </div>
//                   <div className="relative flex justify-center">
//                     <span className="px-4 bg-white text-emerald-600 font-semibold text-sm flex items-center gap-2">
//                       <svg viewBox="0 0 100 100" className="w-4 h-4">
//                         <polygon points="50,5 95,50 50,95 5,50" fill="#10b981"/>
//                       </svg>
//                       {t('auth.accountDetails', 'Account Details')}
//                       <svg viewBox="0 0 100 100" className="w-4 h-4">
//                         <polygon points="50,5 95,50 50,95 5,50" fill="#10b981"/>
//                       </svg>
//                     </span>
//                   </div>
//                 </div>

//                 {/* Username Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-emerald-800 mb-2">
//                     {t('auth.username', 'Username')}
//                     <span className="text-emerald-500 ml-1">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="text"
//                       name="username"
//                       value={form.username}
//                       onChange={handleChange}
//                       onFocus={() => setFocusedField('username')}
//                       onBlur={() => setFocusedField('')}
//                       className={`${inputClasses('username')} pl-10`}
//                       placeholder={t('auth.usernamePlaceholder', 'your_username')}
//                       autoComplete="username"
//                       required
//                     />
//                   </div>
//                   <p className="mt-1 text-xs text-emerald-600 font-medium">
//                     {t('auth.usernameHint', 'Choose a unique username for your account')}
//                   </p>
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label className="block text-sm font-semibold text-emerald-800 mb-2">
//                     {t('auth.password', 'Password')}
//                     <span className="text-emerald-500 ml-1">*</span>
//                   </label>
//                   <div className="relative group">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="w-5 h-5 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                       </svg>
//                     </div>
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={form.password}
//                       onChange={handleChange}
//                       onFocus={() => setFocusedField('password')}
//                       onBlur={() => setFocusedField('')}
//                       className={`${inputClasses('password')} pl-10 pr-12`}
//                       placeholder={t('auth.passwordPlaceholder', '••••••••')}
//                       autoComplete="new-password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     >
//                       {showPassword ? (
//                         <svg className="w-5 h-5 text-emerald-400 hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                         </svg>
//                       ) : (
//                         <svg className="w-5 h-5 text-emerald-400 hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
                  
//                   {/* Password Strength Indicator */}
//                   {form.password && (
//                     <div className="mt-2">
//                       <div className="flex gap-1">
//                         {[1, 2, 3, 4].map((level) => (
//                           <div
//                             key={level}
//                             className={`h-1.5 flex-1 transition-all duration-300 ${
//                               form.password.length >= level * 3
//                                 ? level <= 2
//                                   ? 'bg-gradient-to-r from-red-400 to-red-500 rounded-full'
//                                   : level === 3
//                                   ? 'bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full'
//                                   : 'bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-lg shadow-emerald-400/30'
//                                 : 'bg-emerald-100 rounded-full'
//                             }`}
//                           ></div>
//                         ))}
//                       </div>
//                       <p className="mt-1 text-xs text-emerald-700 font-medium">
//                         {form.password.length < 6
//                           ? t('auth.passwordWeak', 'Password is too weak')
//                           : form.password.length < 8
//                           ? t('auth.passwordFair', 'Password is fair')
//                           : t('auth.passwordStrong', 'Password is strong 💪')}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Submit Button with Polygon Animation */}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="relative w-full py-4 px-6 mt-8 group overflow-hidden rounded-xl"
//                 >
//                   {/* Polygon Background */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-xl shadow-xl shadow-emerald-500/30 group-hover:shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-300"></div>
                  
//                   {/* Animated Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  
//                   {/* Polygon Pattern Overlay */}
//                   <svg className="absolute inset-0 w-full h-full opacity-10 group-hover:opacity-20 transition-opacity" xmlns="http://www.w3.org/2000/svg">
//                     <defs>
//                       <pattern id="btnPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
//                         <polygon points="20,0 40,10 40,30 20,40 0,30 0,10" fill="none" stroke="white" strokeWidth="1"/>
//                       </pattern>
//                     </defs>
//                     <rect width="100%" height="100%" fill="url(#btnPattern)"/>
//                   </svg>

//                   <span className="relative flex items-center justify-center gap-2 text-white font-bold text-lg">
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         {t('auth.registering', 'Creating Account...')}
//                       </>
//                     ) : (
//                       <>
//                         {t('auth.registerButton', 'Create Account')}
//                         <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                         </svg>
//                       </>
//                     )}
//                   </span>
//                 </button>
//               </form>

//               {/* Footer */}
//               <div className="mt-8 text-center">
//                 <p className="text-sm text-emerald-700 font-medium">
//                   {t('auth.haveAccount', 'Already have an account?')}{' '}
//                   <Link
//                     to="/login"
//                     className="font-bold text-emerald-600 hover:text-emerald-800 transition-colors underline decoration-emerald-300 hover:decoration-emerald-500"
//                   >
//                     {t('auth.goToLogin', 'Sign in')}
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Terms with Polygon Icons */}
//           <div className="mt-6 flex items-center justify-center gap-2">
//             <svg viewBox="0 0 100 100" className="w-3 h-3">
//               <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="#34d399" opacity="0.5"/>
//             </svg>
//             <p className="text-center text-xs text-emerald-300 font-medium">
//               {t('auth.termsText', 'By creating an account, you agree to our')}{' '}
//               <Link to="/terms" className="text-emerald-200 hover:text-white font-bold transition-colors">
//                 {t('auth.termsOfService', 'Terms of Service')}
//               </Link>{' '}
//               {t('auth.and', 'and')}{' '}
//               <Link to="/privacy" className="text-emerald-200 hover:text-white font-bold transition-colors">
//                 {t('auth.privacyPolicy', 'Privacy Policy')}
//               </Link>
//             </p>
//             <svg viewBox="0 0 100 100" className="w-3 h-3">
//               <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="#34d399" opacity="0.5"/>
//             </svg>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes scaleUp {
//           from { 
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to { 
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         @keyframes loadingBar {
//           from { width: 0%; }
//           to { width: 100%; }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-5px); }
//           75% { transform: translateX(5px); }
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-15px) rotate(-5deg); }
//         }
//         @keyframes float-slow {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-10px) rotate(3deg); }
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         @keyframes float-random {
//           0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.3; }
//           25% { transform: translateY(-15px) translateX(10px) rotate(90deg); opacity: 0.6; }
//           50% { transform: translateY(0) translateX(20px) rotate(180deg); opacity: 0.3; }
//           75% { transform: translateY(15px) translateX(10px) rotate(270deg); opacity: 0.6; }
//         }
//         @keyframes dash {
//           to { stroke-dashoffset: -1000; }
//         }
//         @keyframes dash-reverse {
//           to { stroke-dashoffset: 1000; }
//         }
//         @keyframes polygon-glow {
//           0%, 100% { filter: drop-shadow(0 0 8px rgba(16,185,129,0.3)); }
//           50% { filter: drop-shadow(0 0 20px rgba(52,211,153,0.6)); }
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//         .animate-scaleUp {
//           animation: scaleUp 0.3s ease-out;
//         }
//         .animate-loadingBar {
//           animation: loadingBar 1.5s ease-in-out;
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//         .animate-float-delayed {
//           animation: float-delayed 8s ease-in-out infinite;
//         }
//         .animate-float-slow {
//           animation: float-slow 10s ease-in-out infinite;
//         }
//         .animate-spin-slow {
//           animation: spin-slow 20s linear infinite;
//         }
//         .animate-float-random {
//           animation: float-random 5s ease-in-out infinite;
//         }
//         .animate-dash {
//           stroke-dasharray: 1000;
//           stroke-dashoffset: 1000;
//           animation: dash 10s linear infinite;
//         }
//         .animate-dash-reverse {
//           stroke-dasharray: 1000;
//           stroke-dashoffset: 0;
//           animation: dash-reverse 10s linear infinite;
//         }
//         .animate-polygon-glow {
//           animation: polygon-glow 3s ease-in-out infinite;
//         }
//         .animate-bounce {
//           animation: bounce 0.5s ease-in-out infinite;
//         }
//         .delay-1000 {
//           animation-delay: 1s;
//         }
//         .delay-2000 {
//           animation-delay: 2s;
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

export default function Register() {
  const { t } = useTranslation();
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    location: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const username = form.username.trim();
    const fullName = form.fullName.trim();
    const phoneNumber = form.phoneNumber.trim();
    const location = form.location.trim();

    if (!fullName) {
      setError(t('auth.fullNameRequired', 'Full name is required'));
      return;
    }

    if (!phoneNumber) {
      setError(t('auth.phoneRequired', 'Phone number is required'));
      return;
    }

    if (!username) {
      setError(t('auth.usernameRequired', 'Username is required'));
      return;
    }

    if (!form.password) {
      setError(t('auth.passwordRequired', 'Password is required'));
      return;
    }

    if (form.password.length < 6) {
      setError(
        t(
          'auth.passwordTooShort',
          'Password must be at least 6 characters'
        )
      );
      return;
    }

    try {
      await register(
        username,
        form.password,
        fullName,
        phoneNumber,
        location
      );

      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Register page error:', err);

      setError(getErrorMessage(err, t));
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(to bottom right, #064e3b, #065f46, #134e4a)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Glowing Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-10rem',
            left: '-10rem',
            width: '600px',
            height: '600px',
            background:
              'linear-gradient(to bottom right, rgba(52,211,153,0.3), rgba(34,197,94,0.2), rgba(45,212,191,0.3))',
            borderRadius: '50%',
            filter: 'blur(64px)',
            animation:
              'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-10rem',
            right: '-10rem',
            width: '600px',
            height: '600px',
            background:
              'linear-gradient(to bottom right, rgba(163,230,53,0.2), rgba(16,185,129,0.3), rgba(22,163,74,0.2))',
            borderRadius: '50%',
            filter: 'blur(64px)',
            animation:
              'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '1s',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            background:
              'linear-gradient(to bottom right, rgba(45,212,191,0.1), rgba(34,197,94,0.15), rgba(5,150,105,0.1))',
            borderRadius: '50%',
            filter: 'blur(64px)',
            animation:
              'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '2s',
          }}
        />

        {/* Polygon Grid */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.2,
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hexGrid"
              x="0"
              y="0"
              width="80"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 0L80 20L80 60L40 80L0 60L0 20Z"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
              />
              <path
                d="M40 80L80 100L80 140L40 160L0 140L0 100Z"
                fill="none"
                stroke="#059669"
                strokeWidth="1"
              />
            </pattern>

            <pattern
              id="triGrid"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M50 0L100 50L50 100L0 50Z"
                fill="none"
                stroke="#34d399"
                strokeWidth="0.8"
              />
              <path
                d="M0 0L50 50L0 100"
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="0.5"
              />
              <path
                d="M100 0L50 50L100 100"
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#hexGrid)" />
          <rect
            width="100%"
            height="100%"
            fill="url(#triGrid)"
            opacity="0.5"
          />
        </svg>

        {/* Floating Polygon */}
        <div
          style={{
            position: 'absolute',
            top: '5rem',
            right: '5rem',
            width: '16rem',
            height: '16rem',
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            style={{ width: '100%', height: '100%' }}
          >
            <polygon
              points="100,10 190,50 190,130 100,190 10,130 10,50"
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
            />

            <polygon
              points="100,30 170,60 170,120 100,170 30,120 30,60"
              fill="rgba(16,185,129,0.1)"
              stroke="#10b981"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Bottom Polygon */}
        <div
          style={{
            position: 'absolute',
            bottom: '5rem',
            left: '5rem',
            width: '18rem',
            height: '18rem',
            animation: 'floatDelayed 8s ease-in-out infinite',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            style={{ width: '100%', height: '100%' }}
          >
            <polygon
              points="100,10 180,60 160,140 60,160 20,100 40,40"
              fill="none"
              stroke="#059669"
              strokeWidth="2"
            />

            <polygon
              points="100,30 160,65 145,130 65,145 35,105 50,50"
              fill="rgba(5,150,105,0.1)"
              stroke="#047857"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Center Polygon */}
        <div
          style={{
            position: 'absolute',
            top: '33%',
            left: '25%',
            width: '12rem',
            height: '12rem',
            animation: 'floatSlow 10s ease-in-out infinite',
          }}
        >
          <svg
            viewBox="0 0 200 200"
            style={{ width: '100%', height: '100%' }}
          >
            <polygon
              points="100,20 190,70 190,150 100,190 10,150 10,70"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Diamond */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '33%',
            width: '6rem',
            height: '6rem',
            animation: 'spinSlow 20s linear infinite',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{ width: '100%', height: '100%' }}
          >
            <rect
              x="10"
              y="10"
              width="80"
              height="80"
              rx="10"
              fill="none"
              stroke="#34d399"
              strokeWidth="1.5"
              transform="rotate(45 50 50)"
            />

            <circle
              cx="50"
              cy="50"
              r="25"
              fill="rgba(52,211,153,0.1)"
              stroke="#10b981"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Floating Triangles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${10 + i * 12}%`,
              left: `${10 + i * 13}%`,
              animationDelay: `${i * 0.5}s`,
              width: '30px',
              height: '30px',
              animation: 'floatRandom 5s ease-in-out infinite',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{ width: '100%', height: '100%' }}
            >
              <polygon
                points="50,5 95,95 5,95"
                fill="rgba(16,185,129,0.15)"
                stroke="#34d399"
                strokeWidth="1"
              />
            </svg>
          </div>
        ))}

        {/* Geometric Lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.1,
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            stroke="#10b981"
            strokeWidth="1"
          />

          <line
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
            stroke="#059669"
            strokeWidth="1"
          />

          <line
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            stroke="#34d399"
            strokeWidth="1"
          />

          <line
            x1="0%"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="#047857"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Language Switcher */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 50,
        }}
      >
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '32rem',
          }}
        >
          {/* Success Overlay */}
          {success && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(to bottom right, white, #ecfdf5)',
                  borderRadius: '1.5rem',
                  padding: '3rem',
                  boxShadow:
                    '0 25px 50px -12px rgba(0,0,0,0.25)',
                  textAlign: 'center',
                  maxWidth: '28rem',
                  margin: '0 1rem',
                  border: '2px solid #a7f3d0',
                }}
              >
                <div
                  style={{
                    width: '5rem',
                    height: '5rem',
                    background:
                      'linear-gradient(to bottom right, #34d399, #22c55e)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <svg
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      color: 'white',
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#064e3b',
                    marginBottom: '0.5rem',
                  }}
                >
                  {t(
                    'auth.registerSuccess',
                    'Registration Successful!'
                  )}
                </h3>

                <p
                  style={{
                    color: '#047857',
                    marginBottom: '1.5rem',
                  }}
                >
                  {t(
                    'auth.redirectingToLogin',
                    'Redirecting to login...'
                  )}
                </p>

                <div
                  style={{
                    width: '100%',
                    background: '#d1fae5',
                    borderRadius: '9999px',
                    height: '0.5rem',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background:
                        'linear-gradient(to right, #34d399, #22c55e)',
                      height: '100%',
                      width: '100%',
                      borderRadius: '9999px',
                      animation: 'progress 1.5s linear',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Brand */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <Link to="/" style={{ display: 'inline-block' }}>
              <div
                style={{
                  position: 'relative',
                  width: '5rem',
                  height: '5rem',
                  margin: '0 auto',
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <defs>
                    <linearGradient
                      id="logoGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#34d399"
                      />
                      <stop
                        offset="50%"
                        stopColor="#10b981"
                      />
                      <stop
                        offset="100%"
                        stopColor="#059669"
                      />
                    </linearGradient>
                  </defs>

                  <polygon
                    points="100,10 190,55 190,145 100,190 10,145 10,55"
                    fill="url(#logoGrad)"
                  />

                  <polygon
                    points="100,30 170,65 170,135 100,170 30,135 30,65"
                    fill="rgba(255,255,255,0.2)"
                    stroke="white"
                    strokeWidth="2"
                  />

                  <text
                    x="100"
                    y="110"
                    textAnchor="middle"
                    fill="white"
                    fontSize="40"
                    fontWeight="bold"
                  >
                    P
                  </text>
                </svg>
              </div>
            </Link>

            <h1
              style={{
                marginTop: '1.5rem',
                fontSize: '1.875rem',
                fontWeight: '800',
              }}
            >
              <span
                style={{
                  background:
                    'linear-gradient(to right, #6ee7b7, #34d399, #5eead4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('app.title')}
              </span>
            </h1>

            <p
              style={{
                marginTop: '0.5rem',
                color: 'rgba(167,243,208,0.8)',
                fontSize: '0.875rem',
                fontWeight: '500',
              }}
            >
              {t(
                'app.tagline',
                'Your Gateway to Exciting Lotteries'
              )}
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              position: 'relative',
              backdropFilter: 'blur(24px)',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '1.5rem',
              boxShadow:
                '0 25px 50px -12px rgba(6,78,59,0.3)',
              padding: '2rem',
              border: '2px solid #a7f3d0',
            }}
          >
            <div style={{ position: 'relative' }}>
              {/* Header */}
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    style={{
                      width: '2rem',
                      height: '2rem',
                    }}
                  >
                    <polygon
                      points="50,10 90,40 90,80 50,100 10,80 10,40"
                      fill="#10b981"
                      opacity="0.8"
                    />

                    <polygon
                      points="50,20 80,42 80,78 50,90 20,78 20,42"
                      fill="white"
                      opacity="0.5"
                    />
                  </svg>

                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#064e3b',
                    }}
                  >
                    {t(
                      'auth.registerTitle',
                      'Create Account'
                    )}
                  </h2>
                </div>

                <p
                  style={{
                    marginTop: '0.5rem',
                    color: '#047857',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                >
                  {t(
                    'auth.registerSubtitle',
                    'Join us and start playing today'
                  )}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: '#fef2f2',
                    border: '2px solid #fca5a5',
                    borderRadius: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}
                  >
                    <svg
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        color: '#ef4444',
                        flexShrink: 0,
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#991b1b',
                        }}
                      >
                        {error}
                      </p>

                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#dc2626',
                          marginTop: '0.25rem',
                        }}
                      >
                        {t(
                          'auth.tryAgain',
                          'Please check your information and try again'
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setError('')}
                      style={{
                        color: '#f87171',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Full Name */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t('auth.fullName', 'Full Name')}
                    <span
                      style={{
                        color: '#10b981',
                        marginLeft: '0.25rem',
                      }}
                    >
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    onFocus={() =>
                      setFocusedField('fullName')
                    }
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border:
                        focusedField === 'fullName'
                          ? '2px solid #34d399'
                          : '2px solid #d1fae5',
                      background: 'white',
                      color: '#1f2937',
                      outline: 'none',
                      fontSize: '0.875rem',
                    }}
                    placeholder={t(
                      'auth.fullNamePlaceholder',
                      'John Doe'
                    )}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t(
                      'auth.phoneNumber',
                      'Phone Number'
                    )}
                    <span
                      style={{
                        color: '#10b981',
                        marginLeft: '0.25rem',
                      }}
                    >
                      *
                    </span>
                  </label>

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onFocus={() =>
                      setFocusedField('phoneNumber')
                    }
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border:
                        focusedField === 'phoneNumber'
                          ? '2px solid #34d399'
                          : '2px solid #d1fae5',
                      background: 'white',
                      color: '#1f2937',
                      outline: 'none',
                      fontSize: '0.875rem',
                    }}
                    placeholder="+251 911 234 567"
                    required
                  />

                  <p
                    style={{
                      marginTop: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#047857',
                    }}
                  >
                    {t(
                      'auth.phoneHint',
                      'Include country code for verification'
                    )}
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t('auth.location', 'Location')}
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    onFocus={() =>
                      setFocusedField('location')
                    }
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border:
                        focusedField === 'location'
                          ? '2px solid #34d399'
                          : '2px solid #d1fae5',
                      background: 'white',
                      color: '#1f2937',
                      outline: 'none',
                      fontSize: '0.875rem',
                    }}
                    placeholder={t(
                      'auth.locationPlaceholder',
                      'Bahir Dar, Ethiopia'
                    )}
                  />
                </div>

                {/* Divider */}
                <div
                  style={{
                    borderTop: '2px solid #a7f3d0',
                    margin: '0.5rem 0',
                    paddingTop: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#047857',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                    }}
                  >
                    {t(
                      'auth.accountDetails',
                      'Account Details'
                    )}
                  </span>
                </div>

                {/* Username */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t('auth.username', 'Username')}
                    <span
                      style={{
                        color: '#10b981',
                        marginLeft: '0.25rem',
                      }}
                    >
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    onFocus={() =>
                      setFocusedField('username')
                    }
                    onBlur={() => setFocusedField('')}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border:
                        focusedField === 'username'
                          ? '2px solid #34d399'
                          : '2px solid #d1fae5',
                      background: 'white',
                      color: '#1f2937',
                      outline: 'none',
                      fontSize: '0.875rem',
                    }}
                    placeholder={t(
                      'auth.usernamePlaceholder',
                      'your_username'
                    )}
                    autoComplete="username"
                    required
                  />

                  <p
                    style={{
                      marginTop: '0.25rem',
                      fontSize: '0.75rem',
                      color: '#047857',
                    }}
                  >
                    {t(
                      'auth.usernameHint',
                      'Choose a unique username for your account'
                    )}
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t('auth.password', 'Password')}
                    <span
                      style={{
                        color: '#10b981',
                        marginLeft: '0.25rem',
                      }}
                    >
                      *
                    </span>
                  </label>

                  <div style={{ position: 'relative' }}>
                    <input
                      type={
                        showPassword ? 'text' : 'password'
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onFocus={() =>
                        setFocusedField('password')
                      }
                      onBlur={() => setFocusedField('')}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding:
                          '0.875rem 3rem 0.875rem 0.875rem',
                        borderRadius: '0.75rem',
                        border:
                          focusedField === 'password'
                            ? '2px solid #34d399'
                            : '2px solid #d1fae5',
                        background: 'white',
                        color: '#1f2937',
                        outline: 'none',
                        fontSize: '0.875rem',
                      }}
                      placeholder={t(
                        'auth.passwordPlaceholder',
                        '••••••••'
                      )}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '0.75rem',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#059669',
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {form.password && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.25rem',
                        }}
                      >
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            style={{
                              height: '0.375rem',
                              flex: 1,
                              background:
                                form.password.length >=
                                level * 3
                                  ? level <= 2
                                    ? '#ef4444'
                                    : level === 3
                                    ? '#f59e0b'
                                    : '#22c55e'
                                  : '#d1fae5',
                              borderRadius: '9999px',
                            }}
                          />
                        ))}
                      </div>

                      <p
                        style={{
                          marginTop: '0.25rem',
                          fontSize: '0.75rem',
                          color: '#047857',
                        }}
                      >
                        {form.password.length < 6
                          ? t(
                              'auth.passwordWeak',
                              'Password is too weak'
                            )
                          : form.password.length < 8
                          ? t(
                              'auth.passwordFair',
                              'Password is fair'
                            )
                          : t(
                              'auth.passwordStrong',
                              'Password is strong 💪'
                            )}
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    marginTop: '1rem',
                    borderRadius: '0.75rem',
                    background:
                      'linear-gradient(to right, #34d399, #22c55e, #14b8a6)',
                    boxShadow:
                      '0 20px 25px -5px rgba(16,185,129,0.3)',
                    border: 'none',
                    cursor: loading
                      ? 'not-allowed'
                      : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.125rem',
                    }}
                  >
                    {loading
                      ? t(
                          'auth.registering',
                          'Creating Account...'
                        )
                      : t(
                          'auth.registerButton',
                          'Create Account'
                        )}
                  </span>
                </button>
              </form>

              {/* Footer */}
              <div
                style={{
                  marginTop: '2rem',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#047857',
                  }}
                >
                  {t(
                    'auth.haveAccount',
                    'Already have an account?'
                  )}{' '}
                  <Link
                    to="/login"
                    style={{
                      fontWeight: 'bold',
                      color: '#059669',
                      textDecoration: 'underline',
                    }}
                  >
                    {t('auth.goToLogin', 'Sign in')}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                color: '#6ee7b7',
              }}
            >
              {t(
                'auth.termsText',
                'By creating an account, you agree to our'
              )}{' '}
              <Link
                to="/terms"
                style={{
                  color: '#a7f3d0',
                  fontWeight: 'bold',
                }}
              >
                {t(
                  'auth.termsOfService',
                  'Terms of Service'
                )}
              </Link>{' '}
              {t('auth.and', 'and')}{' '}
              <Link
                to="/privacy"
                style={{
                  color: '#a7f3d0',
                  fontWeight: 'bold',
                }}
              >
                {t(
                  'auth.privacyPolicy',
                  'Privacy Policy'
                )}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }

          50% {
            opacity: 0.5;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatRandom {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.3;
          }

          25% {
            transform: translateY(-15px) translateX(10px) rotate(90deg);
            opacity: 0.6;
          }

          50% {
            transform: translateY(0) translateX(20px) rotate(180deg);
            opacity: 0.3;
          }

          75% {
            transform: translateY(15px) translateX(10px) rotate(270deg);
            opacity: 0.6;
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}