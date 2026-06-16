import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { useAuth } from "../features/auth/hooks/use-auth";

// Đích redirect của backend sau khi xác thực Google:
// {frontend_url}/auth/callback?access_token=...&refresh_token=...
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { completeGoogleLogin } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // StrictMode chạy effect 2 lần — chỉ xử lý 1 lần.
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    // Bảo mật: xoá token khỏi URL ngay lập tức để không lưu vào
    // history/referrer trước khi làm bất kỳ việc gì khác.
    window.history.replaceState({}, "", "/auth/callback");

    if (!accessToken || !refreshToken) {
      navigate("/login", { replace: true });
      return;
    }

    completeGoogleLogin(accessToken, refreshToken).then((ok) => {
      // Google chỉ dành cho công dân → trang đích /form.
      navigate(ok ? "/form" : "/login", { replace: true });
    });
  }, [completeGoogleLogin, navigate]);

  return <Loading show />;
}
