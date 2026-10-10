import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ROLE_ROUTES } from "./routes/roleRoutes";

import Layout from "./components/Layout";
import Pending from "./pages/pending/Pending";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import NewHome from "./pages/home/NewHome";

// ADMIN
import AdJobsList from "./pages/admin/jobs/All";
import AdJobDetail from "./pages/admin/jobs/Detail";
import AdSavedJobs from "./pages/admin/jobs/Saved";
import AdProfile from "./pages/admin/profile/Profile";
import AdMyBrand from "./pages/admin/mybrand/MyBrand";
import AdCandidates from "./pages/admin/candidates_tracker/Candidates";
import AdStatistics from "./pages/admin/statistics/Statistics";
import AdUsersManagement from "./pages/admin/users/UsersManagement";
import AdNotification from "./pages/admin/notifications/Notification";

// RECRUITER
import RecrProfile from "./pages/recruiter/profile/Profile";
import RecrJobsList from "./pages/recruiter/jobs/All";
import RecrJobDetail from "./pages/recruiter/jobs/Detail";
import RecrSavedJobs from "./pages/recruiter/jobs/Saved";
import RecrCandidates from "./pages/recruiter/candidates_tracker/Candidates";
import RecrNotification from "./pages/recruiter/notifications/Notification";
import RecruiterWorkspace from "./pages/recruiter/dashboard/RecruiterWorkspace";
import EmployeeWorkspace from "./pages/employee/EmployeeWorkspace";
import Update from "./pages/update/Update";
import TermsPage from "./pages/terms/Terms";

function PrivateRoute({ roles }) {
  const { user, authReady } = useAuth();

  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.status !== "Active") return <Navigate to="/pending" replace />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/" replace />;

  return <Outlet />;
}

function DashboardRedirect() {
  const { user, authReady } = useAuth();

  if (!authReady) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.status !== "Active") return <Navigate to="/pending" replace />;

  return <Navigate to={ROLE_ROUTES[user.role]?.dashboard || ROLE_ROUTES[user.role]?.jobs || "/"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { authReady } = useAuth();
  if (!authReady) return null;

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* PUBLIC */}
        <Route path="/" element={<NewHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/employee" element={<SignUp recruiterType="fulltime" />} />
        <Route path="/signup/recruiter-fulltime" element={<Navigate to="/signup/employee" replace />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route path="/notifications/update" element={<Update />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/frontend/update" element={<NewHome />} />

        {/* ADMIN */}
        <Route element={<PrivateRoute roles={["admin", "lower_admin"]} />}>
          <Route path="/admin" element={<Navigate to={ROLE_ROUTES.admin.jobs} replace />} />
          <Route path={ROLE_ROUTES.admin.profile} element={<AdProfile />} />
          <Route path={ROLE_ROUTES.admin.jobs} element={<AdJobsList />} />
          <Route path={ROLE_ROUTES.admin.jobDetail} element={<AdJobDetail />} />
          <Route path={ROLE_ROUTES.admin.savedJobs} element={<AdSavedJobs />} />
          <Route path={ROLE_ROUTES.admin.myBrand} element={<AdMyBrand />} />
          <Route path={ROLE_ROUTES.admin.statistics} element={<AdStatistics />} />
          <Route path={ROLE_ROUTES.admin.candidates} element={<AdCandidates />} />
          <Route path={ROLE_ROUTES.admin.users} element={<AdUsersManagement />} />
          <Route path={ROLE_ROUTES.admin.notification} element={<AdNotification />} />
        </Route>

        {/* RECRUITER */}
        <Route element={<PrivateRoute roles={["recruiter", "recruiter_freelancer"]} />}>
          <Route path="/recruiter" element={<Navigate to={ROLE_ROUTES.recruiter_freelancer.dashboard} replace />} />
          <Route
            path={ROLE_ROUTES.recruiter_freelancer.dashboard}
            element={<RecruiterWorkspace />}
          />
          <Route
            path={ROLE_ROUTES.recruiter_freelancer.profile}
            element={<RecrProfile />}
          />
          <Route
            path={ROLE_ROUTES.recruiter_freelancer.jobs}
            element={<RecrJobsList />}
          />
          <Route
            path={ROLE_ROUTES.recruiter_freelancer.jobDetail}
            element={<RecrJobDetail />}
          />
          <Route
            path={ROLE_ROUTES.recruiter_freelancer.savedJobs}
            element={<RecrSavedJobs />}
          />
          <Route
            path={ROLE_ROUTES.recruiter_freelancer.candidates}
            element={<RecrCandidates />}
          />
          <Route path={ROLE_ROUTES.recruiter_freelancer.notification} element={<RecrNotification />} />
        </Route>

        <Route element={<PrivateRoute roles={["recruiter_fulltime"]} />}>
          <Route path="/employee" element={<EmployeeWorkspace />} />
          <Route path="/recruiter-fulltime" element={<Navigate to="/employee" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
