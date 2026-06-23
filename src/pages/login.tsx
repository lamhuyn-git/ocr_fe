import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLayout from "../features/auth/components/login-layout";
import LoginMethodSelect from "../features/auth/components/login-method-select";
import LoginFormVneid from "../features/auth/components/login-form-vneid";
import LoginFormAccount from "../features/auth/components/login-form-account";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import { useAuth } from "../features/auth/hooks/use-auth";
import { type LoginMethod, type LoginStep } from "../features/auth/types";
import { loginWithGG } from "../features/auth/services/auth-api";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_auth_failed: "Đăng nhập Google thất bại. Vui lòng thử lại.",
  no_user_info: "Không lấy được thông tin tài khoản từ Google.",
  account_disabled: "Tài khoản của bạn đã bị khóa.",
  not_citizen: "Tài khoản này không được đăng nhập bằng Google.",
};

// Đọc lỗi đăng nhập Google từ ?error=... đúng MỘT lần rồi dọn khỏi URL.
// Capture ở module-scope để giá trị sống sót qua mount/unmount/remount của
// React StrictMode (nếu đọc trong component sẽ mất sau khi URL bị scrub).
let _googleError: string | null | undefined;
function readGoogleError(): string | null {
  if (_googleError !== undefined) return _googleError;
  const reason = new URLSearchParams(window.location.search).get("error");
  if (reason) {
    _googleError = GOOGLE_ERROR_MESSAGES[reason] ?? "Đăng nhập Google thất bại.";
    window.history.replaceState({}, "", "/login");
  } else {
    _googleError = null;
  }
  return _googleError;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>(1);
  const [method, setMethod] = useState<LoginMethod | null>(null);
  const [googleError] = useState<string | null>(readGoogleError);
  const { isAuthenticated, isLoading, user, signOut, clearError } = useAuth();

  function handleMethodSelect(selected: LoginMethod) {
    clearError();
    setMethod(selected);
    setStep(2);
  }

  function handleBack() {
    clearError();
    setStep(1);
    setMethod(null);
  }

  function handleGoogleLogin() {
    loginWithGG();
    console.log("Google login clicked");
  }

  if (isAuthenticated && user) {
    return (
      <LoginLayout>
        <div className="mx-auto w-full max-w-[26.25rem] flex flex-col gap-6 items-center">
          <p className="text-h1 font-bold text-text-main text-center leading-none">
            Đăng nhập thành công
          </p>
          <p className="text-para-m-regular text-text-main text-center">
            Xin chào, <span className="text-para-m-semibold">{user.name}</span>
          </p>
          <Button
            variant="secondary"
            size="14px"
            text="Đăng xuất"
            className="w-full justify-center"
            onClick={signOut}
          />
        </div>
      </LoginLayout>
    );
  }

  function renderStep() {
    if (step === 1 || method === null) {
      return <LoginMethodSelect onSelect={handleMethodSelect} />;
    }

    const stepLabel =
      method === "user-vneid"
        ? "Bạn đang đăng nhập bằng tài khoản định danh công dân VNeID. Vui lòng điền đầy đủ thông tin để đăng nhập."
        : "Bạn đang đăng nhập bằng Tài khoản cấp bởi Cổng dịch vụ công quốc gia. Vui lòng điền đầy đủ thông tin để đăng nhập.";

    if (method === "admin-account") {
      return <LoginFormAccount stepLabel={stepLabel} />;
    }

    return (
      <LoginFormVneid stepLabel={stepLabel} onGoogleLogin={handleGoogleLogin} />
    );
  }

  // Bước 1: quay về trang Giới thiệu. Bước 2: quay lại chọn phương thức.
  const onBack =
    step === 2 && method !== null
      ? handleBack
      : () => navigate("/introduction");

  return (
    <LoginLayout onBack={onBack} dotIndex={step === 2 ? 2 : 1}>
      <Loading show={isLoading} />
      <div key={step} className="animate-fade-in-up flex flex-col gap-4">
        {googleError && (
          <div className="mx-auto w-full max-w-[40%] rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-para-m-regular text-red-600">{googleError}</p>
          </div>
        )}
        {renderStep()}
      </div>
    </LoginLayout>
  );
}
