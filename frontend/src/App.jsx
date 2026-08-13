
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import PrivateRoute from './components/PrivateRoute';
// import Navbar from './components/Navbar';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ChangePassword from './pages/ChangePassword';
// import Dashboard from './pages/Dashboard';
// import Users from './pages/Users';
// import Groups from './pages/Groups';
// import NotFound from './pages/NotFound';
// import Lotteries from './pages/lottery/Lotteries';
// import LotteryCreate from './pages/lottery/LotteryCreate';
// import LotteryDetail from './pages/lottery/LotteryDetail';
// import Payments from './pages/payment/Payments';
// import Winners from './pages/winner/Winners';
// import Withdrawals from './pages/withdrawal/Withdrawals';
// import Notifications from './pages/notification/Notifications';
// import Analytics from './pages/admin/Analytics';
// import PaidUsers from './pages/admin/PaidUsers';
// import ChallengeAdminReview from './pages/admin/ChallengeAdminReview';
// import ChallengeFinanceReport from './pages/admin/ChallengeFinanceReport';
// import ChallengeCreate from './pages/challenge/ChallengeCreate';
// import ChallengeDetail from './pages/challenge/ChallengeDetail';

// function Shell({ children }) {
//   const { isAuthenticated } = useAuth();
//   return (
//     <>
//       {isAuthenticated && <Navbar />}
//       <main className="app-main">{children}</main>
//     </>
//   );
// }

// function AppRoutes() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Shell>
//       <Routes>
//         <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
//         <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/users"
//           element={
//             <PrivateRoute roles={['admin']}>
//               <Users />
//             </PrivateRoute>
//           }
//         />
//         {/* Change Password Route */}
//         <Route
//           path="/change-password"
//           element={
//             <PrivateRoute>
//               <ChangePassword />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/groups"
//           element={
//             <PrivateRoute roles={['admin']}>
//               <Groups />
//             </PrivateRoute>
//           }
//         />

//         <Route path="/lotteries" element={<Lotteries />} />
//         <Route
//           path="/lotteries/new"
//           element={
//             <PrivateRoute roles={['admin', 'lottery_manager']}>
//               <LotteryCreate />
//             </PrivateRoute>
//           }
//         />
//         <Route path="/lotteries/:id" element={<LotteryDetail />} />
//         <Route
//           path="/challenges/new"
//           element={
//             <PrivateRoute>
//               <ChallengeCreate />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/challenges/:challengeId"
//           element={
//             <PrivateRoute>
//               <ChallengeDetail />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/payments"
//           element={
//             <PrivateRoute roles={['admin', 'payment_admin']}>
//               <Payments />
//             </PrivateRoute>
//           }
//         />

//         <Route path="/winners" element={<Winners />} />

//         <Route
//           path="/withdrawals"
//           element={
//             <PrivateRoute>
//               <Withdrawals />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/notifications"
//           element={
//             <PrivateRoute>
//               <Notifications />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/admin/challenges/review"
//           element={
//             <PrivateRoute roles={['admin']}>
//               <ChallengeAdminReview />
//             </PrivateRoute>
//           }
//         />

//         {/* Admin/finance: commission-adjustable finance report for paid challenges */}
//         <Route
//           path="/admin/challenges/finance-report"
//           element={
//             <PrivateRoute roles={['admin', 'finance_admin']}>
//               <ChallengeFinanceReport />
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/admin/analytics"
//           element={
//             <PrivateRoute roles={['admin']}>
//               <Analytics />
//             </PrivateRoute>
//           }
//         />

//         {/* Admin: list of all users who have made at least one approved payment */}
//         <Route
//           path="/admin/paid-users"
//           element={
//             <PrivateRoute roles={['admin']}>
//               <PaidUsers />
//             </PrivateRoute>
//           }
//         />

//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Shell>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Login              from './pages/Login';
import Register           from './pages/Register';
import ChangePassword     from './pages/ChangePassword';
import Dashboard          from './pages/Dashboard';
import Users              from './pages/Users';
import Groups             from './pages/Groups';
import NotFound           from './pages/NotFound';

// Lottery
import Lotteries          from './pages/lottery/Lotteries';
import LotteryCreate      from './pages/lottery/LotteryCreate';
import LotteryDetail      from './pages/lottery/LotteryDetail';

// ── NEW ──────────────────────────────────────────────────────────────────────
import MyOrders           from './pages/lottery/MyOrders';
// ─────────────────────────────────────────────────────────────────────────────

// Payment / Winner / Withdrawal
import Payments           from './pages/payment/Payments';
import Winners            from './pages/winner/Winners';
import Withdrawals        from './pages/withdrawal/Withdrawals';
import Notifications      from './pages/notification/Notifications';

// Admin
import Analytics          from './pages/admin/Analytics';
import PaidUsers          from './pages/admin/PaidUsers';
import ChallengeAdminReview   from './pages/admin/ChallengeAdminReview';
import ChallengeFinanceReport from './pages/admin/ChallengeFinanceReport';

// Challenge
import ChallengeCreate    from './pages/challenge/ChallengeCreate';
import ChallengeDetail    from './pages/challenge/ChallengeDetail';

function Shell({ children }) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {isAuthenticated && <Navbar />}
      <main className="app-main">{children}</main>
    </>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Shell>
      <Routes>
        {/* Auth */}
        <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Core */}
        <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/users"           element={<PrivateRoute roles={['admin']}><Users /></PrivateRoute>} />
        <Route path="/groups"          element={<PrivateRoute roles={['admin']}><Groups /></PrivateRoute>} />

        {/* Lottery */}
        <Route path="/lotteries"        element={<Lotteries />} />
        <Route path="/lotteries/new"    element={<PrivateRoute roles={['admin', 'lottery_manager']}><LotteryCreate /></PrivateRoute>} />
        <Route path="/lotteries/:id"    element={<LotteryDetail />} />

        {/* ── NEW: My Orders ─────────────────────────────────────────────── */}
        <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
        {/* ────────────────────────────────────────────────────────────────── */}

        {/* Challenges */}
        <Route path="/challenges/new"           element={<PrivateRoute><ChallengeCreate /></PrivateRoute>} />
        <Route path="/challenges/:challengeId"  element={<PrivateRoute><ChallengeDetail /></PrivateRoute>} />

        {/* Payments / Winners / Withdrawals */}
        <Route path="/payments"    element={<PrivateRoute roles={['admin', 'payment_admin']}><Payments /></PrivateRoute>} />
        <Route path="/winners"     element={<Winners />} />
        <Route path="/withdrawals" element={<PrivateRoute><Withdrawals /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/challenges/review"          element={<PrivateRoute roles={['admin']}><ChallengeAdminReview /></PrivateRoute>} />
        <Route path="/admin/challenges/finance-report"  element={<PrivateRoute roles={['admin', 'finance_admin']}><ChallengeFinanceReport /></PrivateRoute>} />
        <Route path="/admin/analytics"                  element={<PrivateRoute roles={['admin']}><Analytics /></PrivateRoute>} />
        <Route path="/admin/paid-users"                 element={<PrivateRoute roles={['admin']}><PaidUsers /></PrivateRoute>} />

        {/* Fallbacks */}
        <Route path="/"  element={<Navigate to="/dashboard" replace />} />
        <Route path="*"  element={<NotFound />} />
      </Routes>
    </Shell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import PrivateRoute from './components/PrivateRoute';
// import Navbar from './components/Navbar';

// // Pages
// import Login              from './pages/Login';
// import Register           from './pages/Register';
// import ChangePassword     from './pages/ChangePassword';
// import Dashboard          from './pages/Dashboard';
// import Users              from './pages/Users';
// import Groups             from './pages/Groups';
// import NotFound           from './pages/NotFound';

// // Lottery
// import Lotteries          from './pages/lottery/Lotteries';
// import LotteryCreate      from './pages/lottery/LotteryCreate';
// import LotteryDetail      from './pages/lottery/LotteryDetail';
// import MyOrders           from './pages/lottery/MyOrders';
// //ticket
// import MyTickets          from './pages/lottery/MyTickets';
// // Payment / Winner / Withdrawal
// import Payments           from './pages/payment/Payments';
// import Winners            from './pages/winner/Winners';
// import Withdrawals        from './pages/withdrawal/Withdrawals';
// import Notifications      from './pages/notification/Notifications';

// // Admin
// import Analytics          from './pages/admin/Analytics';
// import PaidUsers          from './pages/admin/PaidUsers';
// import ChallengeAdminReview   from './pages/admin/ChallengeAdminReview';
// import ChallengeFinanceReport from './pages/admin/ChallengeFinanceReport';
// import Chat                from './pages/chat';

// // Challenge
// import ChallengeCreate    from './pages/challenge/ChallengeCreate';
// import ChallengeDetail    from './pages/challenge/ChallengeDetail';

// function Shell({ children }) {
//   const { isAuthenticated } = useAuth();
//   return (
//     <>
//       {isAuthenticated && <Navbar />}
//       <main className="app-main">{children}</main>
//     </>
//   );
// }

// function AppRoutes() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Shell>
//       <Routes>
//         {/* Auth */}
//         <Route path="/login"    element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
//         <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

//         {/* Core */}
//         <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
//         <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
//         <Route path="/users"           element={<PrivateRoute roles={['admin']}><Users /></PrivateRoute>} />
//         <Route path="/groups"          element={<PrivateRoute roles={['admin']}><Groups /></PrivateRoute>} />

//         {/* Lottery */}
//         <Route path="/lotteries"        element={<Lotteries />} />
//         <Route path="/lotteries/new"    element={<PrivateRoute roles={['admin', 'lottery_manager']}><LotteryCreate /></PrivateRoute>} />
//         <Route path="/lotteries/:id"    element={<LotteryDetail />} />

//         {/* My Orders — shows a user's own payments, including rejection reasons */}
//         <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
//         <Route path="/my-tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
//         {/* Challenges */}
//         <Route path="/challenges/new"           element={<PrivateRoute><ChallengeCreate /></PrivateRoute>} />
//         <Route path="/challenges/:challengeId"  element={<PrivateRoute><ChallengeDetail /></PrivateRoute>} />

//         {/* Payments (admin) / Winners / Withdrawals */}
//         <Route path="/payments"    element={<PrivateRoute roles={['admin', 'payment_admin']}><Payments /></PrivateRoute>} />
//         <Route path="/chat"         element={<PrivateRoute><Chat /></PrivateRoute>} />
//         <Route path="/admin/chat"   element={<PrivateRoute roles={['admin']}><Chat /></PrivateRoute>} />
//         <Route path="/winners"     element={<Winners />} />
//         <Route path="/withdrawals" element={<PrivateRoute><Withdrawals /></PrivateRoute>} />
//         <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

//         {/* Admin */}
//         <Route path="/admin/challenges/review"          element={<PrivateRoute roles={['admin']}><ChallengeAdminReview /></PrivateRoute>} />
//         <Route path="/admin/challenges/finance-report"  element={<PrivateRoute roles={['admin', 'finance_admin']}><ChallengeFinanceReport /></PrivateRoute>} />
//         <Route path="/admin/analytics"                  element={<PrivateRoute roles={['admin']}><Analytics /></PrivateRoute>} />
//         <Route path="/admin/paid-users"                 element={<PrivateRoute roles={['admin']}><PaidUsers /></PrivateRoute>} />

//         {/* Fallbacks */}
//         <Route path="/"  element={<Navigate to="/dashboard" replace />} />
//         <Route path="*"  element={<NotFound />} />
//       </Routes>
//     </Shell>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }