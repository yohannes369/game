import React from 'react';
import { useTheme } from '../../hooks/useTheme';

function ChangePassword() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} py-8`}>
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
          <h1 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Change Password
          </h1>
          <form className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Current Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'} border`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
