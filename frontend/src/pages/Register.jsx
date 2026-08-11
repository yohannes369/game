
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

//   function handleChange(e) {
//     setForm((f) => ({
//       ...f,
//       [e.target.name]: e.target.value
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');

//     try {
//       await register(
//         form.username,
//         form.password,
//         form.fullName,
//         form.phoneNumber,
//         form.location
//       );

//       setSuccess(true);

//       setTimeout(() => navigate('/login'), 1200);

//     } catch (err) {
//       setError(getErrorMessage(err, t));
//     }
//   }

//   return (
//     <div className="auth-page">
//       <div className="auth-page-lang">
//         <LanguageSwitcher />
//       </div>

//       <div className="auth-card">
//         <div className="auth-brand">
//           <span className="brand-mark" aria-hidden="true" />
//           <h1>{t('app.title')}</h1>
//           <p className="auth-tagline">{t('app.tagline')}</p>
//         </div>

//         <h2 className="auth-heading">{t('auth.registerTitle')}</h2>

//         {error && <div className="alert alert-error">{error}</div>}

//         {success && (
//           <div className="alert alert-success">
//             {t('auth.registerSuccess')}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="form">

//           <label className="field">
//             <span>{t('auth.fullName')}</span>
//             <input
//               name="fullName"
//               value={form.fullName}
//               onChange={handleChange}
//               required
//             />
//           </label>


//           <label className="field">
//             <span>Phone Number</span>
//             <input
//               name="phoneNumber"
//               value={form.phoneNumber}
//               onChange={handleChange}
//               placeholder="+251911234567"
//               required
//             />
//           </label>


//           <label className="field">
//             <span>Location</span>
//             <input
//               name="location"
//               value={form.location}
//               onChange={handleChange}
//               placeholder="Bahir Dar, Ethiopia"
//             />
//           </label>


//           <label className="field">
//             <span>{t('auth.username')}</span>
//             <input
//               name="username"
//               value={form.username}
//               onChange={handleChange}
//               autoComplete="username"
//               required
//             />
//             <small>{t('auth.usernameHint')}</small>
//           </label>


//           <label className="field">
//             <span>{t('auth.password')}</span>

//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               autoComplete="new-password"
//               required
//             />

//             <small>{t('auth.passwordHint')}</small>
//           </label>


//           <button
//             className="btn btn-primary btn-block"
//             type="submit"
//             disabled={loading}
//           >
//             {loading
//               ? t('auth.registering')
//               : t('auth.registerButton')}
//           </button>

//         </form>


//         <p className="auth-switch">
//           {t('auth.haveAccount')}{' '}
//           <Link to="/login">
//             {t('auth.goToLogin')}
//           </Link>
//         </p>

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

export default function Register() {
  const { t } = useTranslation();
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    location: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  function handleChange(e) {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Basic validation
    if (form.password.length < 6) {
      setError(t('auth.passwordTooShort', 'Password must be at least 6 characters'));
      return;
    }

    try {
      await register(
        form.username,
        form.password,
        form.fullName,
        form.phoneNumber,
        form.location
      );

      setSuccess(true);

      setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
      setError(getErrorMessage(err, t));
    }
  }

  const inputClasses = (fieldName) => `
    w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300
    bg-white text-gray-900 placeholder-gray-400
    ${focusedField === fieldName 
      ? 'border-indigo-500 ring-4 ring-indigo-50 shadow-lg' 
      : error && !form[fieldName] 
        ? 'border-red-300 hover:border-red-400' 
        : 'border-gray-200 hover:border-indigo-300 focus:border-indigo-500'
    }
    outline-none text-sm
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Animated Success Overlay */}
          {success && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center max-w-md mx-4 animate-scaleUp">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('auth.registerSuccess', 'Registration Successful!')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('auth.redirectingToLogin', 'Redirecting to login...')}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full animate-loadingBar"></div>
                </div>
              </div>
            </div>
          )}

          {/* Brand Section */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3">
                <span className="text-3xl sm:text-4xl">🎲</span>
              </div>
            </Link>
            <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              {t('app.title')}
            </h1>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              {t('app.tagline', 'Your Gateway to Exciting Lotteries')}
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 lg:p-10 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t('auth.registerTitle', 'Create Account')}
              </h2>
              <p className="mt-2 text-gray-500 text-sm">
                {t('auth.registerSubtitle', 'Join us and start playing today')}
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-red-800">{error}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {t('auth.tryAgain', 'Please check your information and try again')}
                    </p>
                  </div>
                  <button 
                    onClick={() => setError('')}
                    className="ml-auto text-red-400 hover:text-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.fullName', 'Full Name')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField('')}
                    className={`${inputClasses('fullName')} pl-10`}
                    placeholder={t('auth.fullNamePlaceholder', 'John Doe')}
                    required
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.phoneNumber', 'Phone Number')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField('')}
                    className={`${inputClasses('phoneNumber')} pl-10`}
                    placeholder="+251 911 234 567"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {t('auth.phoneHint', 'Include country code for verification')}
                </p>
              </div>

              {/* Location Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.location', 'Location')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('location')}
                    onBlur={() => setFocusedField('')}
                    className={`${inputClasses('location')} pl-10`}
                    placeholder={t('auth.locationPlaceholder', 'Bahir Dar, Ethiopia')}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400 font-medium">
                    {t('auth.accountDetails', 'Account Details')}
                  </span>
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.username', 'Username')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField('')}
                    className={`${inputClasses('username')} pl-10`}
                    placeholder={t('auth.usernamePlaceholder', 'your_username')}
                    autoComplete="username"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {t('auth.usernameHint', 'Choose a unique username for your account')}
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.password', 'Password')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`${inputClasses('password')} pl-10 pr-12`}
                    placeholder={t('auth.passwordPlaceholder', '••••••••')}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            form.password.length >= level * 3
                              ? level <= 2
                                ? 'bg-red-400'
                                : level === 3
                                ? 'bg-yellow-400'
                                : 'bg-green-400'
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      {form.password.length < 6
                        ? t('auth.passwordWeak', 'Password is too weak')
                        : form.password.length < 8
                        ? t('auth.passwordFair', 'Password is fair')
                        : t('auth.passwordStrong', 'Password is strong')}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('auth.registering', 'Creating Account...')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {t('auth.registerButton', 'Create Account')}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.haveAccount', 'Already have an account?')}{' '}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  {t('auth.goToLogin', 'Sign in')}
                </Link>
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-gray-400">
            {t('auth.termsText', 'By creating an account, you agree to our')}{' '}
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-700">
              {t('auth.termsOfService', 'Terms of Service')}
            </Link>{' '}
            {t('auth.and', 'and')}{' '}
            <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700">
              {t('auth.privacyPolicy', 'Privacy Policy')}
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes loadingBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s ease-out;
        }
        .animate-loadingBar {
          animation: loadingBar 1.5s ease-in-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-bounce {
          animation: bounce 0.5s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}