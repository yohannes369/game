import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/auth/PrivateRoute';
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';

// Public Pages
import PublicHome from './pages/public/Home';
import LotteriesPublic from './pages/public/Lotteries';
import LotteryDetailPublic from './pages/public/LotteryDetail';
import NotFound from './pages/common/NotFound';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import UserChallenges from './pages/user/Challenges';
import ChallengeCreate from './pages/user/ChallengeCreate';
import ChallengeDetail from './pages/user/ChallengeDetail';
import UserPayments from './pages/user/Payments';
import UserWithdrawals from './pages/user/Withdrawals';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminLotteries from './pages/admin/Lotteries';
import LotteryCreate from './pages/admin/LotteryCreate';
import AdminPayments from './pages/admin/Payments';
import AdminChallenges from './pages/admin/Challenges';
import ChallengeAdminReview from './pages/admin/ChallengeReview';
import ChallengeFinanceReport from './pages/admin/ChallengeFinanceReport';
import AdminUsers from './pages/admin/Users';
import AdminWithdrawals from './pages/admin/Withdrawals';
import Analytics from './pages/admin/Analytics';
import PaidUsers from './pages/admin/PaidUsers';

// Common Pages
import Winners from './pages/common/Winners';
import Notifications from './pages/common/Notifications';

function Shell({ children }) {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <MainLayout>{children}</MainLayout>
      ) : (
        <AuthLayout>{children}</AuthLayout>
      )}
    </>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Shell>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={user ? <Navigate to="/user/dashboard" replace /> : <PublicHome />} />
        <Route path="/login" element={user ? <Navigate to="/user/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/user/dashboard" replace /> : <Register />} />
        <Route path="/lotteries" element={<LotteriesPublic />} />
        <Route path="/lotteries/:id" element={<LotteryDetailPublic />} />
        <Route path="/winners" element={<Winners />} />

        {/* USER ROUTES */}
        <Route path="/user/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/user/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/user/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
        <Route path="/user/challenges" element={<PrivateRoute><UserChallenges /></PrivateRoute>} />
        <Route path="/user/challenges/new" element={<PrivateRoute><ChallengeCreate /></PrivateRoute>} />
        <Route path="/user/challenges/:challengeId" element={<PrivateRoute><ChallengeDetail /></PrivateRoute>} />
        <Route path="/user/payments" element={<PrivateRoute><UserPayments /></PrivateRoute>} />
        <Route path="/user/withdrawals" element={<PrivateRoute><UserWithdrawals /></PrivateRoute>} />
        <Route path="/user/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/lotteries" element={<PrivateRoute roles={['admin', 'lottery_manager']}><AdminLotteries /></PrivateRoute>} />
        <Route path="/admin/lotteries/new" element={<PrivateRoute roles={['admin', 'lottery_manager']}><LotteryCreate /></PrivateRoute>} />
        <Route path="/admin/payments" element={<PrivateRoute roles={['admin', 'payment_admin']}><AdminPayments /></PrivateRoute>} />
        <Route path="/admin/challenges" element={<PrivateRoute roles={['admin']}><AdminChallenges /></PrivateRoute>} />
        <Route path="/admin/challenges/review" element={<PrivateRoute roles={['admin']}><ChallengeAdminReview /></PrivateRoute>} />
        <Route path="/admin/challenges/finance-report" element={<PrivateRoute roles={['admin', 'finance_admin']}><ChallengeFinanceReport /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/withdrawals" element={<PrivateRoute roles={['admin']}><AdminWithdrawals /></PrivateRoute>} />
        <Route path="/admin/analytics" element={<PrivateRoute roles={['admin']}><Analytics /></PrivateRoute>} />
        <Route path="/admin/paid-users" element={<PrivateRoute roles={['admin']}><PaidUsers /></PrivateRoute>} />

        {/* 404 ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
