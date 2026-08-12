import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import api from '../../api/axios';

function LotteryDetail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const [lottery, setLottery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLottery();
  }, [id]);

  const fetchLottery = async () => {
    try {
      const response = await api.get(`/lotteries/${id}`);
      setLottery(response.data);
    } catch (error) {
      console.error('Error fetching lottery:', error);
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

  if (!lottery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Lottery not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {lottery.name}
          </h1>
          <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {lottery.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Prize Pool</p>
              <p className="text-2xl font-bold text-blue-600">${lottery.prize_pool}</p>
            </div>
            <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
              <p className="text-xl font-bold text-green-600">{lottery.status}</p>
            </div>
            <div className={`p-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Draw Date</p>
              <p className="text-lg font-bold">{lottery.draw_date ? new Date(lottery.draw_date).toLocaleDateString() : 'TBA'}</p>
            </div>
          </div>

          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Participate
          </button>
        </div>
      </div>
    </div>
  );
}

export default LotteryDetail;
