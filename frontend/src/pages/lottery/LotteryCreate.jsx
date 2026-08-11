
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// const emptyForm = {
//   name: '',
//   description: '',
//   ticketMode: 'fixed',
//   ticketPrice: '',
//   spinAt: '',
// };

// export default function LotteryCreate() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [form, setForm] = useState(emptyForm);
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);


//   function handleChange(e) {
//     setForm((f) => ({
//       ...f,
//       [e.target.name]: e.target.value,
//     }));
//   }


//   async function handleSubmit(e) {
//     e.preventDefault();

//     setError('');
//     setSaving(true);

//     try {

//       const spinDate = form.spinAt ? new Date(form.spinAt).toISOString() : null;


//       const payload = {
//         name: form.name.trim(),

//         description: form.description.trim(),

//         ticketMode: form.ticketMode,

//         ticketPrice: Number(form.ticketPrice),

//         // required by backend
//         startDate: spinDate,

//         endDate: spinDate,

//         spinAt: spinDate,
//       };


//       console.log("Lottery Payload:", payload);


//       const { data } = await api.post('/lotteries', payload);


//       navigate(`/lotteries/${data.lottery.id}`);


//     } catch (err) {

//       console.error(err);

//       setError(
//         err.response?.data?.message ||
//         t('errors.generic')
//       );

//     } finally {

//       setSaving(false);

//     }
//   }


//   return (
//     <div className="page">

//       <div className="page-header">
//         <h2>{t('lottery.create')}</h2>
//       </div>


//       <div className="card" style={{ maxWidth: 520 }}>


//         {error && (
//           <div className="alert alert-error">
//             {error}
//           </div>
//         )}



//         <form onSubmit={handleSubmit} className="form">


//           <label className="field">

//             <span>Lottery Name</span>

//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter lottery name"
//             />

//           </label>



//           <label className="field">

//             <span>Description</span>

//             <input
//               type="text"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               placeholder="Optional description"
//             />

//           </label>



//           <label className="field">

//             <span>Ticket Mode</span>

//             <select
//               name="ticketMode"
//               value={form.ticketMode}
//               onChange={handleChange}
//             >

//               <option value="fixed">
//                 Fixed
//               </option>


//               <option value="package">
//                 Package
//               </option>


//               <option value="custom">
//                 Custom
//               </option>

//             </select>


//           </label>



//           <label className="field">

//             <span>Ticket Price</span>


//             <input
//               type="number"
//               min="1"
//               step="0.01"
//               name="ticketPrice"
//               value={form.ticketPrice}
//               onChange={handleChange}
//               required
//             />


//           </label>




//           <label className="field">

//             <span>Spin Date & Time</span>


//             <input
//               type="datetime-local"
//               name="spinAt"
//               value={form.spinAt}
//               onChange={handleChange}
//               required
//             />


//           </label>




//           <div className="modal-actions">


//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={saving}
//             >

//               {saving
//                 ? "Saving..."
//                 : "Create Lottery"}

//             </button>


//           </div>



//         </form>


//       </div>


//     </div>
//   );


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import api from '../../api/axios';

// const emptyForm = {
//   name: '',
//   description: '',
//   ticketMode: 'fixed',
//   ticketPrice: '',
//   spinAt: '',
// };

// export default function LotteryCreate() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   const [form, setForm] = useState(emptyForm);
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);

//   function handleChange(e) {
//     setForm((f) => ({
//       ...f,
//       [e.target.name]: e.target.value,
//     }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     setError('');
//     setSaving(true);

//     try {
//       const spinDate = form.spinAt ? new Date(form.spinAt).toISOString() : null;

//       const payload = {
//         name: form.name.trim(),
//         description: form.description.trim(),
//         ticketMode: form.ticketMode,
//         ticketPrice: Number(form.ticketPrice),
//         // required by backend
//         startDate: spinDate,
//         endDate: spinDate,
//         spinAt: spinDate,
//       };

//       console.log('Lottery Payload:', payload);

//       const { data } = await api.post('/lotteries', payload);

//       navigate(`/lotteries/${data.lottery.id}`);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || t('errors.generic'));
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
//             {t('lottery.create')}
//           </h2>
//           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//             Configure parameters and spin schedules for the new lottery draw.
//           </p>
//         </div>
//       </div>

//       {/* Main Card */}
//       <div className="max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
//         {error && (
//           <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Lottery Name */}
//           <div className="space-y-1.5">
//             <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
//               Lottery Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter lottery name"
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-1.5">
//             <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
//               Description
//             </label>
//             <input
//               type="text"
//               id="description"
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               placeholder="Optional description"
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
//             />
//           </div>

//           {/* Ticket Mode */}
//           <div className="space-y-1.5">
//             <label htmlFor="ticketMode" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
//               Ticket Mode
//             </label>
//             <select
//               id="ticketMode"
//               name="ticketMode"
//               value={form.ticketMode}
//               onChange={handleChange}
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
//             >
//               <option value="fixed">Fixed</option>
//               <option value="package">Package</option>
//               <option value="custom">Custom</option>
//             </select>
//           </div>

//           {/* Ticket Price */}
//           <div className="space-y-1.5">
//             <label htmlFor="ticketPrice" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
//               Ticket Price
//             </label>
//             <input
//               type="number"
//               id="ticketPrice"
//               min="1"
//               step="0.01"
//               name="ticketPrice"
//               value={form.ticketPrice}
//               onChange={handleChange}
//               required
//               placeholder="0.00"
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
//             />
//           </div>

//           {/* Spin Date & Time */}
//           <div className="space-y-1.5">
//             <label htmlFor="spinAt" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
//               Spin Date & Time
//             </label>
//             <input
//               type="datetime-local"
//               id="spinAt"
//               name="spinAt"
//               value={form.spinAt}
//               onChange={handleChange}
//               required
//               className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
//             />
//           </div>

//           {/* Submit Actions */}
//           <div className="pt-3">
//             <button
//               type="submit"
//               disabled={saving}
//               className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {saving ? 'Saving...' : 'Create Lottery'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../api/axios';

const emptyForm = {
  name: '',
  description: '',
  ticketMode: 'fixed',
  ticketPrice: '',
  spinAt: '',
};

const TICKET_MODES = [
  { value: 'fixed', label: 'Fixed Price', desc: 'Single ticket price for all participants' },
  { value: 'package', label: 'Package Deal', desc: 'Bundled tickets at a discounted rate' },
  { value: 'custom', label: 'Custom Pricing', desc: 'Variable pricing tiers' },
];

export default function LotteryCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Field-level validation
  const errors = useMemo(() => {
    const e = {};
    if (touched.name && !form.name.trim()) e.name = 'Lottery name is required';
    if (touched.name && form.name.trim().length < 3) e.name = 'Must be at least 3 characters';
    if (touched.ticketPrice && form.ticketPrice !== '') {
      const price = Number(form.ticketPrice);
      if (isNaN(price) || price <= 0) e.ticketPrice = 'Enter a valid price greater than 0';
    }
    if (touched.spinAt && !form.spinAt) e.spinAt = 'Spin date is required';
    if (touched.spinAt && form.spinAt) {
      const selected = new Date(form.spinAt);
      if (selected <= new Date()) e.spinAt = 'Spin date must be in the future';
    }
    return e;
  }, [form, touched]);

  const isValid = form.name.trim().length >= 3 && Number(form.ticketPrice) > 0 && form.spinAt && new Date(form.spinAt) > new Date();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
  }

  function handleBlur(e) {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, ticketPrice: true, spinAt: true, description: true, ticketMode: true });
    
    if (!isValid) return;

    setError('');
    setSaving(true);

    try {
      const spinDate = form.spinAt ? new Date(form.spinAt).toISOString() : null;

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        ticketMode: form.ticketMode,
        ticketPrice: Number(form.ticketPrice),
        startDate: spinDate,
        endDate: spinDate,
        spinAt: spinDate,
      };

      const { data } = await api.post('/lotteries', payload);
      navigate(`/lotteries/${data.lottery.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t('errors.generic'));
    } finally {
      setSaving(false);
    }
  }

  const inputBase =
    'w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-4 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 sm:text-base';
  const inputNormal =
    'border-gray-300 hover:border-gray-400 focus:border-indigo-600 focus:ring-indigo-600/10 dark:border-gray-700 dark:hover:border-gray-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10';
  const inputError =
    'border-red-300 focus:border-red-500 focus:ring-red-500/10 dark:border-red-900/50 dark:focus:border-red-500';

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* Breadcrumb / Back */}
      <div className="mb-6">
        <Link
          to="/lotteries"
          className="group inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="mr-1.5 h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Lotteries
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {t('lottery.create')}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 sm:text-base">
          Configure parameters and spin schedules for the new lottery draw.
        </p>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 sm:p-8">
          {/* Global Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Basic Info */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  Basic Information
                </h2>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <span>Lottery Name <span className="text-red-500">*</span></span>
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                    {form.name.length}/100
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  maxLength={100}
                  placeholder="e.g., Summer Mega Draw 2026"
                  className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
                />
                {errors.name && (
                  <p className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe the lottery, prizes, or special rules..."
                  className={`${inputBase} ${inputNormal} resize-y`}
                />
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Optional. This will be visible to participants on the lottery page.
                </p>
              </div>
            </div>

            {/* Section: Ticket Settings */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2 dark:border-gray-800">
                <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />
                </svg>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  Ticket Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Ticket Mode */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Ticket Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {TICKET_MODES.map((mode) => (
                      <label
                        key={mode.value}
                        className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                          form.ticketMode === mode.value
                            ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/20 dark:ring-indigo-500'
                            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ticketMode"
                          value={mode.value}
                          checked={form.ticketMode === mode.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className={`text-sm font-semibold ${form.ticketMode === mode.value ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                          {mode.label}
                        </span>
                        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {mode.desc}
                        </span>
                        {form.ticketMode === mode.value && (
                          <svg className="absolute right-3 top-3 h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ticket Price */}
                <div className="space-y-1.5">
                  <label htmlFor="ticketPrice" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Ticket Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm text-gray-500 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      id="ticketPrice"
                      name="ticketPrice"
                      min="0.01"
                      step="0.01"
                      value={form.ticketPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="0.00"
                      className={`${inputBase} ${errors.ticketPrice ? inputError : inputNormal} pl-8`}
                    />
                  </div>
                  {errors.ticketPrice && (
                    <p className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      {errors.ticketPrice}
                    </p>
                  )}
                </div>

                {/* Spin Date */}
                <div className="space-y-1.5">
                  <label htmlFor="spinAt" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Spin Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="spinAt"
                    name="spinAt"
                    value={form.spinAt}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`${inputBase} ${errors.spinAt ? inputError : inputNormal} [color-scheme:light] dark:[color-scheme:dark]`}
                  />
                  {errors.spinAt ? (
                    <p className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                      {errors.spinAt}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Select a future date and time.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/lotteries"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || !isValid}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-indigo-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {saving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create Lottery
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}