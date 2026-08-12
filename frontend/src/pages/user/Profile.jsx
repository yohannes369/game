import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

function UserProfile() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} py-8`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
          <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            My Profile
          </h1>

          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {user?.fullName}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {user?.username}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {user?.email || 'Not set'}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Role
              </label>
              <div className={`p-3 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {user?.role?.toUpperCase()}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <a
                href="/user/change-password"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Change Password
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
