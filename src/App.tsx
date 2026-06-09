import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/auth-store";
import { useAuthContext } from "./store/auth-store";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import RegistrationPage from "./pages/registration";
import Loading from "./components/ui/Loading";

function AppRoutes() {
  const { isAuthenticated, isInitializing, user } = useAuthContext();

  // Đang khôi phục phiên (reload) → chưa điều hướng, hiện Loading để tránh
  // nháy về /login trước khi refresh xong.
  if (isInitializing) return <Loading show />;

  // After login: citizen → /registration, officer → /dashboard
  const homeRoute = isAuthenticated
    ? user?.role === "user"
      ? "/registration"
      : "/dashboard"
    : "/login";

  return (
    <Routes>
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
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
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
