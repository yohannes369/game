import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../utils/errorMessage';

export default function ChangePassword() {
  const { t } = useTranslation();
  const { changePassword, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setMessage('');


    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }


    try {

      const data = await changePassword(
        form.currentPassword,
        form.newPassword
      );


      setMessage(
        data.message || 'Password changed successfully.'
      );


      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);


    } catch (err) {

      setError(getErrorMessage(err, t));

    }
  }



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Change Password
        </h1>


        {error && (
          <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
            {error}
          </div>
        )}


        {message && (
          <div className="mb-4 rounded-lg bg-green-100 text-green-700 px-4 py-3">
            {message}
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-5">


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>


        </form>


      </div>

    </div>
  );
}