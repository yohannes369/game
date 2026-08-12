import React from 'react';
import { useTheme } from '../../hooks/useTheme';

function Auth({ type = 'login' }) {
  const { theme } = useTheme();
  const isLogin = type === 'login';

  return (
    <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
      <h2 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form className="space-y-4">
        {!isLogin && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
              placeholder="John Doe"
            />
          </div>
        )}
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Username
          </label>
          <input
            type="text"
            className={`w-full px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
            placeholder="Username"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Password
          </label>
          <input
            type="password"
            className={`w-full px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p className={`text-center mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <a href={isLogin ? '/register' : '/login'} className="text-blue-600 hover:underline">
          {isLogin ? 'Register' : 'Login'}
        </a>
      </p>
    </div>
  );
}

export default Auth;
