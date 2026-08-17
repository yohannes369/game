
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import api from '../api/axios';

// const emptyForm = { id: null, username: '', password: '', fullName: '', role: 'user', groupId: '' };

// export default function Users() {
//   const { t } = useTranslation();
//   const [users, setUsers] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [form, setForm] = useState(emptyForm);
//   const [showForm, setShowForm] = useState(false);
//   const [error, setError] = useState('');

//   async function loadData() {
//     const [usersRes, groupsRes] = await Promise.all([api.get('/users'), api.get('/groups')]);
//     setUsers(usersRes.data.users);
//     setGroups(groupsRes.data.groups);
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   function openCreate() {
//     setForm(emptyForm);
//     setError('');
//     setShowForm(true);
//   }

//   function openEdit(u) {
//     setForm({ id: u.id, username: u.username, password: '', fullName: u.fullName, role: u.role, groupId: u.groupId || '' });
//     setError('');
//     setShowForm(true);
//   }

//   function handleChange(e) {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError('');
//     const payload = {
//       username: form.username,
//       fullName: form.fullName,
//       role: form.role,
//       groupId: form.groupId ? Number(form.groupId) : null,
//     };
//     if (form.password) payload.password = form.password;
//     if (!form.id) payload.password = form.password;

//     try {
//       if (form.id) {
//         await api.put(`/users/${form.id}`, payload);
//       } else {
//         await api.post('/users', payload);
//       }
//       setShowForm(false);
//       await loadData();
//     } catch (err) {
//       setError(err.response?.data?.message || t('errors.generic'));
//     }
//   }

//   async function handleDelete(id) {
//     if (!window.confirm(t('users.confirmDelete'))) return;
//     await api.delete(`/users/${id}`);
//     await loadData();
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h2 className="text-2xl font-bold text-gray-900">
//           {t('users.title')}
//         </h2>
//         <button
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//           onClick={openCreate}
//           type="button"
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           {t('users.create')}
//         </button>
//       </div>

//       {/* Table Card */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t('users.table.username')}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t('users.table.fullName')}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t('users.table.role')}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t('users.table.group')}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t('users.table.status')}
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   {t('users.table.actions')}
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((u) => (
//                 <tr key={u.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {u.username}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {u.fullName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       u.role === 'admin' 
//                         ? 'bg-purple-100 text-purple-800'
//                         : u.role === 'group_leader'
//                         ? 'bg-blue-100 text-blue-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {t(`roles.${u.role}`)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {u.groupName || t('users.noGroup')}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                       u.isActive 
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-red-100 text-red-800'
//                     }`}>
//                       {u.isActive ? t('users.active') : t('users.inactive')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <div className="flex items-center gap-2">
//                       <button
//                         className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                         onClick={() => openEdit(u)}
//                         type="button"
//                       >
//                         <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                         </svg>
//                         {t('users.edit')}
//                       </button>
//                       <button
//                         className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
//                         onClick={() => handleDelete(u.id)}
//                         type="button"
//                       >
//                         <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         {t('users.delete')}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {showForm && (
//         <div 
//           className="fixed inset-0 z-50 overflow-y-auto"
//           onClick={() => setShowForm(false)}
//         >
//           <div className="flex items-center justify-center min-h-screen px-4">
//             {/* Backdrop */}
//             <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

//             {/* Modal Content */}
//             <div 
//               className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {form.id ? t('users.form.editTitle') : t('users.form.title')}
//                 </h3>
//               </div>

//               {error && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                   <div className="flex items-center">
//                     <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <p className="text-sm text-red-700">{error}</p>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('auth.fullName')}
//                   </label>
//                   <input
//                     name="fullName"
//                     value={form.fullName}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('auth.username')}
//                   </label>
//                   <input
//                     name="username"
//                     value={form.username}
//                     onChange={handleChange}
//                     required
//                     disabled={!!form.id}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('auth.password')}
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                     required={!form.id}
//                     placeholder={form.id ? t('users.form.leaveBlank') : ''}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('users.form.role')}
//                   </label>
//                   <select
//                     name="role"
//                     value={form.role}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   >
//                     <option value="user">{t('roles.user')}</option>
//                     <option value="group_leader">{t('roles.group_leader')}</option>
//                     <option value="admin">{t('roles.admin')}</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('users.form.group')}
//                   </label>
//                   <select
//                     name="groupId"
//                     value={form.groupId}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   >
//                     <option value="">{t('users.form.noGroup')}</option>
//                     {groups.map((g) => (
//                       <option key={g.id} value={g.id}>
//                         {g.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                     onClick={() => setShowForm(false)}
//                   >
//                     {t('users.form.cancel')}
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                   >
//                     {t('users.form.save')}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const emptyForm = {
  id: null,
  username: '',
  password: '',
  fullName: '',
  role: 'user',
  groupId: '',
};

export default function Users() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // Load users and groups
  const loadData = useCallback(async () => {
    try {
      const [usersRes, groupsRes] = await Promise.all([
        api.get('/users'),
        api.get('/groups'),
      ]);

      setUsers(usersRes.data.users || []);
      setGroups(groupsRes.data.groups || []);
    } catch (err) {
      console.error('Failed to load users/groups:', err);

      setError(
        err.response?.data?.message || t('errors.generic')
      );
    }
  }, [t]);

  // Initial load + automatic refresh every 5 seconds
  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [loadData]);

  // Reload immediately when admin returns to the browser tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [loadData]);

  function openCreate() {
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(u) {
    setForm({
      id: u.id,
      username: u.username,
      password: '',
      fullName: u.fullName,
      role: u.role,
      groupId: u.groupId || '',
    });

    setError('');
    setShowForm(true);
  }

  function handleChange(e) {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const payload = {
      username: form.username,
      fullName: form.fullName,
      role: form.role,
      groupId: form.groupId
        ? Number(form.groupId)
        : null,
    };

    if (form.password) {
      payload.password = form.password;
    }

    if (!form.id) {
      payload.password = form.password;
    }

    try {
      if (form.id) {
        await api.put(`/users/${form.id}`, payload);
      } else {
        await api.post('/users', payload);
      }

      setShowForm(false);

      // Immediately reload after admin creates/edits a user
      await loadData();
    } catch (err) {
      console.error('User save error:', err);

      setError(
        err.response?.data?.message || t('errors.generic')
      );
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(t('users.confirmDelete'))) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);

      // Immediately reload after deleting
      await loadData();
    } catch (err) {
      console.error('User delete error:', err);

      setError(
        err.response?.data?.message || t('errors.generic')
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          {t('users.title')}
        </h2>

        <button
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          onClick={openCreate}
          type="button"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>

          {t('users.create')}
        </button>

      </div>

      {/* Error */}
      {error && !showForm && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.username')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.fullName')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.role')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.group')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.status')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('users.table.actions')}
                </th>

              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {users.map((u) => (

                <tr
                  key={u.id}
                  className="hover:bg-gray-50 transition-colors"
                >

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {u.username}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.fullName}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">

                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'group_leader'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t(`roles.${u.role}`)}
                    </span>

                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.groupName || t('users.noGroup')}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">

                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        u.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.isActive
                        ? t('users.active')
                        : t('users.inactive')}
                    </span>

                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">

                    <div className="flex items-center gap-2">

                      {/* Edit */}
                      <button
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        onClick={() => openEdit(u)}
                        type="button"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>

                        {t('users.edit')}
                      </button>

                      {/* Delete */}
                      <button
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        onClick={() => handleDelete(u.id)}
                        type="button"
                      >
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 011 1v3M4 7h16"
                          />
                        </svg>

                        {t('users.delete')}
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Modal */}
      {showForm && (

        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setShowForm(false)}
        >

          <div className="flex items-center justify-center min-h-screen px-4">

            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

            <div
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="mb-6">

                <h3 className="text-lg font-semibold text-gray-900">
                  {form.id
                    ? t('users.form.editTitle')
                    : t('users.form.title')}
                </h3>

              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">

                  <div className="flex items-center">

                    <svg
                      className="w-5 h-5 text-red-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <p className="text-sm text-red-700">
                      {error}
                    </p>

                  </div>

                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* Full Name */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.fullName')}
                  </label>

                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />

                </div>

                {/* Username */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.username')}
                  </label>

                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    disabled={!!form.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />

                </div>

                {/* Password */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.password')}
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required={!form.id}
                    placeholder={
                      form.id
                        ? t('users.form.leaveBlank')
                        : ''
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />

                </div>

                {/* Role */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('users.form.role')}
                  </label>

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >

                    <option value="user">
                      {t('roles.user')}
                    </option>

                    <option value="group_leader">
                      {t('roles.group_leader')}
                    </option>

                    <option value="admin">
                      {t('roles.admin')}
                    </option>

                  </select>

                </div>

                {/* Group */}
                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('users.form.group')}
                  </label>

                  <select
                    name="groupId"
                    value={form.groupId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >

                    <option value="">
                      {t('users.form.noGroup')}
                    </option>

                    {groups.map((g) => (
                      <option
                        key={g.id}
                        value={g.id}
                      >
                        {g.name}
                      </option>
                    ))}

                  </select>

                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">

                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    onClick={() => setShowForm(false)}
                  >
                    {t('users.form.cancel')}
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {t('users.form.save')}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}