import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import ChallengePage from './pages/ChallengePage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Certificates from './pages/Certificates';

// New Pages
import MyCourses from './pages/MyCourses';
import Practice from './pages/Practice';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import AITutor from './pages/AITutor';
import UserLayout from './components/Layout/UserLayout';
import PracticeCatalog from './pages/PracticeCatalog';

// Admin Pages
import AdminLayout from './components/Admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManager from './pages/admin/CourseManager';
import ChallengeManager from './pages/admin/ChallengeManager';
import BadgeManager from './pages/admin/BadgeManager';
import AllUsers from './pages/admin/AllUsers';
import PremiumUsers from './pages/admin/PremiumUsers';
import Revenue from './pages/admin/Revenue';
import AdminSettings from './pages/admin/AdminSettings';

import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  const location = useLocation();
  const showFooterPaths = ['/', '/login', '/register'];
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  // Show Navbar on all routes except login, register, admin
  const hideNavbarPaths = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname) && !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditionally show Top Navbar */}
      {shouldShowNavbar && <Navbar />}
      
      <main className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />

          {/* User Platform Routes - With Sidebar */}
          <Route element={<UserLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<ChallengePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/practice" element={<PracticeCatalog />} />
            <Route path="/practice/:course/:level" element={<Practice />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/certificates" element={<Certificates />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<CourseManager />} />
            <Route path="challenges" element={<ChallengeManager />} />
            <Route path="badges" element={<BadgeManager />} />
            <Route path="users" element={<AllUsers />} />
            <Route path="users/premium" element={<PremiumUsers />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </main>

      {shouldShowFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
