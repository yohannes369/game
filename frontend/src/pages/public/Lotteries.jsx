import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';

function Lotteries() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLotteries();
  }, []);

  const fetchLotteries = async () => {
    try {
      const response = await api.get('/lotteries');
      setLotteries(response.data);
    } catch (error) {
      console.error('Error fetching lotteries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {t('lotteries.title')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotteries.map((lottery) => (
            <div
              key={lottery.id}
              className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md hover:shadow-lg transition-shadow cursor-pointer`}
              onClick={() => window.location.href = `/lotteries/${lottery.id}`}
            >
              <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {lottery.name}
              </h2>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {lottery.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">${lottery.prize_pool}</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lottery.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {lotteries.length === 0 && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            No lotteries available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}

export default Lotteries;
