import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./store/auth-store";
import { useAuthContext } from "./store/auth-store";
import LoginPage from "./pages/login";
import AuthCallbackPage from "./pages/auth-callback";
import IntroductionPage from "./pages/introduction";
import DashboardPage from "./pages/dashboard";
import RegistrationPage from "./pages/registration";
import FormPage from "./pages/form";
import FormDetailPage from "./pages/form-detail";
import Loading from "./components/ui/Loading";

function AppRoutes() {
  const { isAuthenticated, isInitializing, accountType } = useAuthContext();
  const location = useLocation();

  // Đang khôi phục phiên (reload) → chưa điều hướng, hiện Loading để tránh
  // nháy về /login trước khi refresh xong.
  if (isInitializing) return <Loading show />;

  // Trang đích theo loại tài khoản (suy từ endpoint login, không dựa role BE):
  // citizen → /form, staff → /dashboard.
  const homeRoute = isAuthenticated
    ? accountType === "citizen"
      ? "/form"
      : "/dashboard"
    : "/login";

  return (
    // key đổi theo route -> remount + chạy lại hiệu ứng float-up mỗi lần đổi trang.
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
      {/* Đích redirect OAuth Google — public, tự xử lý token rồi điều hướng. */}
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
          isAuthenticated ? <Navigate to={homeRoute} replace /> : <LoginPage />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
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
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
      </Routes>
    </div>
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
