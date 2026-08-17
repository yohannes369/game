// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';
// import { PAYMENT_METHODS, AUTO_LOCK_MINUTES } from './lotteryConstants';

// export default function PaymentForm({ lottery, onSubmitted, closingSoon }) {
//   const { t } = useTranslation();
//   const isPackageMode = lottery.ticketMode === 'package';

//   const [packageId,     setPackageId]     = useState('');
//   const [amount,        setAmount]        = useState('');
//   const [method,        setMethod]        = useState(PAYMENT_METHODS[0]);
//   const [senderName,    setSenderName]    = useState('');
//   const [phoneNumber,   setPhoneNumber]   = useState('');
//   const [transactionId, setTransactionId] = useState('');
//   const [screenshot,    setScreenshot]    = useState(null);
//   const [error,         setError]         = useState('');
//   const [success,       setSuccess]       = useState('');
//   const [saving,        setSaving]        = useState(false);

//   const selectedPkg   = lottery.packages?.find((p) => String(p.id) === String(packageId));
//   const previewAmount = isPackageMode ? selectedPkg?.price : amount;
//   const previewTickets =
//     !isPackageMode && lottery.ticketMode === 'custom' && amount && lottery.ticketPrice
//       ? Math.floor(Number(amount) / Number(lottery.ticketPrice))
//       : null;

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError(''); setSuccess(''); setSaving(true);
//     try {
//       const fd = new FormData();
//       fd.append('lotteryId',     lottery.id);
//       fd.append('amount',        isPackageMode ? previewAmount : amount);
//       fd.append('method',        method);
//       fd.append('senderName',    senderName);
//       fd.append('phoneNumber',   phoneNumber);
//       fd.append('transactionId', transactionId);
//       if (isPackageMode) fd.append('packageId', packageId);
//       if (screenshot)    fd.append('screenshot', screenshot);

//       await api.post('/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

//       setSuccess(t('payments.submitSuccess'));
//       setPackageId(''); setAmount(''); setSenderName('');
//       setPhoneNumber(''); setTransactionId(''); setScreenshot(null);
//       onSubmitted?.();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
//       <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
//         {t('payments.buyTickets')}
//       </h3>

//       {closingSoon && (
//         <Alert variant="red">
//           {t('payments.closingSoon', {
//             defaultValue: `Ticket sales close in under ${AUTO_LOCK_MINUTES} minutes.`,
//             minutes: AUTO_LOCK_MINUTES,
//           })}
//         </Alert>
//       )}
//       {error   && <Alert variant="red">{error}</Alert>}
//       {success && <Alert variant="green">{success}</Alert>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Package picker or amount input */}
//         {isPackageMode ? (
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {(lottery.packages || []).map((p) => {
//               const isSelected = String(packageId) === String(p.id);
//               return (
//                 <div
//                   key={p.id}
//                   onClick={() => setPackageId(p.id)}
//                   className={`cursor-pointer rounded-lg border p-4 transition-all ${
//                     isSelected
//                       ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/30'
//                       : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
//                   }`}
//                 >
//                   <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
//                   <div className="my-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{p.price}</div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {p.ticketCount} {t('lottery.tickets')}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <Field label={t('payments.amount')}>
//             <input
//               type="number" min="0" step="0.01" value={amount} required
//               onChange={(e) => setAmount(e.target.value)}
//               className={inputCls}
//             />
//             {previewTickets !== null && (
//               <small className="block text-xs text-gray-500 dark:text-gray-400">
//                 {t('payments.ticketsPreview', { count: previewTickets })}
//               </small>
//             )}
//           </Field>
//         )}

//         <Field label={t('payments.method')}>
//           <select value={method} onChange={(e) => setMethod(e.target.value)} required className={inputCls}>
//             {PAYMENT_METHODS.map((m) => (
//               <option key={m} value={m}>{t(`payments.methods.${m}`)}</option>
//             ))}
//           </select>
//         </Field>

//         <Field label={t('payments.senderName')}>
//           <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)} required className={inputCls} />
//         </Field>

//         <Field label={t('payments.phoneNumber')}>
//           <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className={inputCls} />
//         </Field>

//         <Field label={t('payments.transactionId')}>
//           <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required className={inputCls} />
//         </Field>

//         <Field label={t('payments.screenshot')}>
//           <input
//             type="file" accept="image/*"
//             onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-950 dark:file:text-indigo-300"
//           />
//         </Field>

//         {previewAmount && (
//           <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
//             {t('payments.total')}: {previewAmount}
//           </p>
//         )}

//         <div className="flex justify-end pt-2">
//           <button
//             type="submit"
//             disabled={saving || closingSoon || (isPackageMode && !packageId)}
//             className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {saving ? t('common.saving') : t('payments.submit')}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// // ── tiny local helpers ──────────────────────────────────────────────────────

// const inputCls =
//   'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400';

// function Field({ label, children }) {
//   return (
//     <label className="block space-y-1">
//       <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
//       {children}
//     </label>
//   );
// }

// function Alert({ variant, children }) {
//   const styles = {
//     red:   'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300',
//     green: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
//   };
//   return (
//     <div className={`mb-4 rounded-lg p-4 text-sm font-medium ${styles[variant]}`}>
//       {children}
//     </div>
//   );
// }
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';
import { PAYMENT_METHODS, AUTO_LOCK_MINUTES } from './lotteryConstants';

export default function PaymentForm({ lottery, onSubmitted, closingSoon }) {
  const { t } = useTranslation();

  const isPackageMode = lottery?.ticketMode === 'package';

  const [packageId, setPackageId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [senderName, setSenderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Selected package
  const selectedPkg = lottery?.packages?.find(
    (p) => String(p.id) === String(packageId)
  );

  // Amount that will actually be submitted
  const previewAmount = isPackageMode
    ? selectedPkg?.price
    : amount;

  // Calculate tickets for custom mode
  const previewTickets =
    !isPackageMode &&
    lottery?.ticketMode === 'custom' &&
    amount &&
    lottery?.ticketPrice
      ? Math.floor(
          Number(amount) / Number(lottery.ticketPrice)
        )
      : null;

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Basic frontend validation
    if (!lottery?.id) {
      setError('Lottery information is missing.');
      return;
    }

    if (isPackageMode && !packageId) {
      setError('Please select a package.');
      return;
    }

    if (!isPackageMode && (!amount || Number(amount) <= 0)) {
      setError('Please enter a valid amount.');
      return;
    }

    if (!senderName.trim()) {
      setError('Sender name is required.');
      return;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!transactionId.trim()) {
      setError('Transaction ID is required.');
      return;
    }

    if (closingSoon) {
      setError(
        `Ticket sales close in under ${AUTO_LOCK_MINUTES} minutes.`
      );
      return;
    }

    setSaving(true);

    try {
      const fd = new FormData();

      fd.append('lotteryId', String(lottery.id));

      fd.append(
        'amount',
        String(
          isPackageMode
            ? Number(previewAmount)
            : Number(amount)
        )
      );

      // IMPORTANT:
      // This must be one of:
      // telebirr, cbe, bank
      fd.append('method', method);

      fd.append('senderName', senderName.trim());
      fd.append('phoneNumber', phoneNumber.trim());
      fd.append('transactionId', transactionId.trim());

      if (isPackageMode) {
        fd.append('packageId', String(packageId));
      }

      if (screenshot) {
        fd.append('screenshot', screenshot);
      }

      await api.post('/payments', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(
        t(
          'payments.submitSuccess',
          'Payment submitted successfully. Please wait for admin approval.'
        )
      );

      // Reset form
      setPackageId('');
      setAmount('');
      setMethod(PAYMENT_METHODS[0]);
      setSenderName('');
      setPhoneNumber('');
      setTransactionId('');
      setScreenshot(null);

      // Reset file input
      const fileInput = document.getElementById(
        'payment-screenshot'
      );

      if (fileInput) {
        fileInput.value = '';
      }

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      console.error('Payment submission error:', err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          t('errors.generic', 'Something went wrong.')
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* Header */}
      <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        {t('payments.buyTickets', 'Buy Tickets')}
      </h3>

      {/* Closing warning */}
      {closingSoon && (
        <Alert variant="red">
          {t(
            'payments.closingSoon',
            `Ticket sales close in under ${AUTO_LOCK_MINUTES} minutes.`,
            {
              minutes: AUTO_LOCK_MINUTES,
            }
          )}
        </Alert>
      )}

      {/* Error */}
      {error && (
        <Alert variant="red">
          {error}
        </Alert>
      )}

      {/* Success */}
      {success && (
        <Alert variant="green">
          {success}
        </Alert>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        {/* PACKAGE MODE */}
        {isPackageMode ? (
          <Field
            label={t(
              'payments.package',
              'Select Package'
            )}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {(lottery.packages || []).length === 0 ? (
                <p className="text-sm text-red-600">
                  No packages are available.
                </p>
              ) : (
                lottery.packages.map((p) => {
                  const isSelected =
                    String(packageId) === String(p.id);

                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() =>
                        setPackageId(p.id)
                      }
                      className={`text-left rounded-lg border p-4 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                      }`}
                    >

                      <div className="font-semibold text-gray-900 dark:text-white">
                        {p.name}
                      </div>

                      <div className="my-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {p.price} Birr
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {p.ticketCount}{' '}
                        {t(
                          'lottery.tickets',
                          'Tickets'
                        )}
                      </div>

                    </button>
                  );
                })
              )}

            </div>
          </Field>
        ) : (
          /* FIXED / CUSTOM MODE */
          <Field
            label={t(
              'payments.amount',
              'Amount'
            )}
          >
            <div className="relative">

              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                required
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                className={inputCls}
                placeholder="Enter amount"
              />

            </div>

            {lottery?.ticketPrice && (
              <small className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                Ticket price:{' '}
                {Number(
                  lottery.ticketPrice
                ).toFixed(2)}{' '}
                Birr
              </small>
            )}

            {previewTickets !== null && (
              <small className="mt-1 block text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {t(
                  'payments.ticketsPreview',
                  `${previewTickets} ticket(s)`,
                  {
                    count: previewTickets,
                  }
                )}
              </small>
            )}
          </Field>
        )}

        {/* PAYMENT METHOD */}
        <Field
          label={t(
            'payments.method',
            'Payment Method'
          )}
        >
          <select
            value={method}
            onChange={(e) =>
              setMethod(e.target.value)
            }
            required
            className={inputCls}
          >

            <option value="telebirr">
              Telebirr
            </option>

            <option value="cbe">
              CBE Birr
            </option>

            <option value="bank">
              Bank Transfer
            </option>

          </select>
        </Field>

        {/* SENDER NAME */}
        <Field
          label={t(
            'payments.senderName',
            'Sender Name'
          )}
        >
          <input
            type="text"
            value={senderName}
            onChange={(e) =>
              setSenderName(e.target.value)
            }
            required
            maxLength={150}
            className={inputCls}
            placeholder="Name used for payment"
          />
        </Field>

        {/* PHONE */}
        <Field
          label={t(
            'payments.phoneNumber',
            'Phone Number'
          )}
        >
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
            required
            maxLength={20}
            className={inputCls}
            placeholder="09XXXXXXXX"
          />
        </Field>

        {/* TRANSACTION ID */}
        <Field
          label={t(
            'payments.transactionId',
            'Transaction ID'
          )}
        >
          <input
            type="text"
            value={transactionId}
            onChange={(e) =>
              setTransactionId(e.target.value)
            }
            required
            maxLength={100}
            className={inputCls}
            placeholder="Enter transaction ID"
          />
        </Field>

        {/* SCREENSHOT */}
        <Field
          label={t(
            'payments.screenshot',
            'Payment Screenshot'
          )}
        >
          <input
            id="payment-screenshot"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) =>
              setScreenshot(
                e.target.files?.[0] || null
              )
            }
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-indigo-950 dark:file:text-indigo-300"
          />

          {screenshot && (
            <p className="mt-1 text-xs text-gray-500">
              Selected:{' '}
              {screenshot.name}
            </p>
          )}
        </Field>

        {/* TOTAL */}
        {previewAmount && (
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

            <div className="flex items-center justify-between">

              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t(
                  'payments.total',
                  'Total'
                )}
              </span>

              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {Number(
                  previewAmount
                ).toFixed(2)}{' '}
                Birr
              </span>

            </div>

          </div>
        )}

        {/* SUBMIT */}
        <div className="flex justify-end pt-2">

          <button
            type="submit"
            disabled={
              saving ||
              closingSoon ||
              (isPackageMode &&
                !packageId)
            }
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {saving
              ? t(
                  'common.saving',
                  'Submitting...'
                )
              : t(
                  'payments.submit',
                  'Submit Payment'
                )}

          </button>

        </div>

      </form>
    </div>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const inputCls =
  'w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400';

function Field({ label, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      {children}
    </label>
  );
}

function Alert({ variant, children }) {
  const styles = {
    red:
      'bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300',

    green:
      'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  };

  return (
    <div
      className={`mb-4 rounded-lg p-4 text-sm font-medium ${
        styles[variant] || styles.red
      }`}
    >
      {children}
    </div>
  );
}