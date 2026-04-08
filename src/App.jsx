import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { PERMISSIONS } from './utils/rolePermissions';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedAccess from './pages/UnauthorizedAccess';
import DoctorDashboard from './pages/DoctorDashboard';
import ParentDashboard from './pages/ParentDashboard';
import DietEntryPage from './pages/DietEntryPage';
import ParentBMITrendsPage from './pages/ParentBMITrendsPage';
import ParentRecommendationsPage from './pages/ParentRecommendationsPage';
import DoctorRecommendationPage from './pages/DoctorRecommendationPage';
import DoctorReportsPage from './pages/DoctorReportsPage';
import ChildDashboard from './pages/ChildDashboard';
import MealPlannerPage from './pages/MealPlannerPage';
import TelehealthChatPage from './pages/TelehealthChatPage';
import EducationHubPage from './pages/EducationHubPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminEducationPage from './pages/AdminEducationPage';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/unauthorized" element={<UnauthorizedAccess />} />

        {/* Dashboard Routes wrapped with Layout */}
        <Route path="/" element={<RoleProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Doctor Routes */}
            <Route element={<RoleProtectedRoute permission={PERMISSIONS.VIEW_ASSIGNED_CHILDREN} />}>
              <Route path="doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="doctor-dashboard/recommendation" element={<DoctorRecommendationPage />} />
              <Route path="doctor-dashboard/reports" element={<DoctorReportsPage />} />
              <Route path="doctor-dashboard/chat" element={<TelehealthChatPage />} />
            </Route>

            {/* Parent Routes */}
            <Route element={<RoleProtectedRoute permission={PERMISSIONS.MANAGE_CHILD_PROFILE} />}>
              <Route path="parent-dashboard" element={<ParentDashboard />} />
              <Route path="parent-dashboard/diet-entry" element={<DietEntryPage />} />
              <Route path="parent-dashboard/recommendations" element={<ParentRecommendationsPage />} />
              <Route path="parent-dashboard/bmi-trends" element={<ParentBMITrendsPage />} />
              <Route path="parent-dashboard/meal-planner" element={<MealPlannerPage />} />
              <Route path="parent-dashboard/chat" element={<TelehealthChatPage />} />
              <Route path="parent-dashboard/education" element={<EducationHubPage />} />
            </Route>

            {/* Child Routes */}
            <Route element={<RoleProtectedRoute permission={PERMISSIONS.VIEW_CHILD_DASHBOARD} />}>
              <Route path="child-dashboard" element={<ChildDashboard />} />
              <Route path="child-dashboard/education" element={<EducationHubPage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleProtectedRoute permission={PERMISSIONS.MANAGE_USERS} />}>
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-education" element={<AdminEducationPage />} />
            </Route>

          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
