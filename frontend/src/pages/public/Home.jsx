import React from 'react';
import { useTheme } from '../../hooks/useTheme';

function Home() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome to Lottery
          </h1>
          <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Experience the thrill of winning with our innovative lottery platform
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/lotteries"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Lotteries
            </a>
            <a
              href="/login"
              className={`px-8 py-3 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
