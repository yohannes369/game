
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// const amounts = [100, 200, 500];

// export default function ChallengeCreate() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const [amount, setAmount] = useState(amounts[0]);
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError('');
//     setSaving(true);

//     try {
//       const { data } = await api.post('/challenges', { amount });
//       navigate(`/challenges/${data.challenge.challengeId}`);
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="flex flex-col gap-1">
//         <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
//           {t('challenge.createTitle', 'Create Challenge')}
//         </h2>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Set up a 1v1 match and challenge another player for a real-money stake.
//         </p>
//       </div>

//       {/* Main Form Card */}
//       <div className="max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
//         {error && (
//           <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Amount Selection */}
//           <div className="space-y-2">
//             <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
//               {t('challenge.amount', 'Challenge Amount')}
//             </label>

//             {/* Visual Preset Selection Buttons */}
//             <div className="grid grid-cols-3 gap-3">
//               {amounts.map((value) => {
//                 const isSelected = amount === value;
//                 return (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => setAmount(value)}
//                     className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
//                       isSelected
//                         ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 ring-2 ring-indigo-600/20 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
//                         : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
//                     }`}
//                   >
//                     <span className="text-lg font-bold">{value}</span>
//                     <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
//                       Birr
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Contextual Info Card */}
//           <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
//             <div className="flex gap-3">
//               <span className="text-base">ℹ️</span>
//               <p className="text-xs leading-relaxed text-blue-900 dark:text-blue-300">
//                 {t(
//                   'challenge.createHint',
//                   'Create a one-to-one real-money challenge with a fixed stake. Both players submit payment references and an admin will approve before the draw.'
//                 )}
//               </p>
//             </div>
//           </div>

//           {/* Action Button */}
//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={saving}
//               className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {saving
//                 ? t('common.saving', 'Saving...')
//                 : t('challenge.createButton', 'Create Challenge')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const PRESET_AMOUNTS = [100, 200, 500];

export default function ChallengeCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('100');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const numericAmount = Number(amount);
    if (!numericAmount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError(t('challenge.invalidAmount', 'Please enter a valid challenge amount greater than 0 Birr.'));
      return;
    }

    setSaving(true);

    try {
      const { data } = await api.post('/challenges', { amount: numericAmount });

      const targetChallengeId = data?.challenge?.challengeId || data?.challengeId || data?.id;

      if (targetChallengeId) {
        navigate(`/challenges/${targetChallengeId}`);
      } else {
        throw new Error('Challenge created, but no valid challenge ID was returned.');
      }
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors) ? err.response.data.errors[0]?.msg : null) ||
        err.message ||
        t('errors.generic', 'An error occurred. Please try again.');

      setError(backendMessage);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {t('challenge.createTitle', 'Create Challenge')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Set up a 1v1 match and challenge another player for a real-money stake.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Custom Amount Input Field */}
          <div className="space-y-2">
            <label htmlFor="custom-amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('challenge.amount', 'Challenge Amount (Birr)')}
            </label>

            <div className="relative rounded-xl shadow-sm">
              <input
                id="custom-amount"
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter custom amount..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-bold text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500"
                required
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Birr</span>
              </div>
            </div>
          </div>

          {/* Quick Preset Selection Buttons */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
              {t('challenge.presetHint', 'Or choose a quick preset:')}
            </label>

            <div className="grid grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((val) => {
                const isSelected = Number(amount) === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(String(val))}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 ring-2 ring-indigo-600/20 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-base font-bold">{val}</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Birr</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contextual Info Card */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
            <div className="flex gap-3">
              <span className="text-base">ℹ️</span>
              <p className="text-xs leading-relaxed text-blue-900 dark:text-blue-300">
                {t(
                  'challenge.createHint',
                  'Create a one-to-one real-money challenge with a custom stake. Both players submit payment references and an admin will approve before the draw.'
                )}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? t('common.saving', 'Saving...')
                : t('challenge.createButton', 'Create Challenge')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}