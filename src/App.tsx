import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./store/auth-store";
import { useAuthContext } from "./store/auth-store";
import { ToastProvider } from "./store/toast-store";
import { NotificationProvider } from "./features/notifications/notification-store";
import LoginPage from "./pages/login";
import AuthCallbackPage from "./pages/auth-callback";
import IntroductionPage from "./pages/introduction";
import DashboardPage from "./pages/dashboard";
import RegistrationPage from "./pages/registration";
import FormPage from "./pages/form";
import FormDetailPage from "./pages/form-detail";
import LookupPage from "./pages/lookup";
import TemporaryResidencePage from "./pages/temporary-residence";
import AdministrativeUnitsPage from "./pages/administrative-units";
import UsersPage from "./pages/users";
import Loading from "./components/ui/Loading";

function AppRoutes() {
  const { isAuthenticated, isInitializing, accountType } = useAuthContext();
  const location = useLocation();

  if (isInitializing) return <Loading show />;

  // Navigate trang đích theo loại tài khoản
  const homeRoute = isAuthenticated
    ? accountType === "citizen"
      ? "/form"
      : "/dashboard"
    : "/login";

  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="/introduction"
          element={
            isAuthenticated ? (
              <Navigate to={homeRoute} replace />
            ) : (
              <IntroductionPage />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={homeRoute} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/registration"
          element={
            isAuthenticated ? (
              <RegistrationPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/form"
          element={
            isAuthenticated ? <FormPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/form-detail"
          element={
            isAuthenticated ? (
              <FormDetailPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/lookup"
          element={
            isAuthenticated ? <LookupPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/temporary-residence"
          element={
            isAuthenticated ? (
              <TemporaryResidencePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/administrative-units"
          element={
            isAuthenticated ? (
              <AdministrativeUnitsPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated ? (
              <UsersPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to={homeRoute} replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
