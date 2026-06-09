import { useState } from "react";
import LoginLayout from "../features/auth/components/login-layout";
import LoginMethodSelect from "../features/auth/components/login-method-select";
import LoginFormVneid from "../features/auth/components/login-form-vneid";
import LoginFormAccount from "../features/auth/components/login-form-account";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import { useAuth } from "../features/auth/hooks/use-auth";
import { type LoginMethod, type LoginStep } from "../features/auth/types";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>(1);
  const [method, setMethod] = useState<LoginMethod | null>(null);
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

  if (isAuthenticated && user) {
    return (
      <LoginLayout>
        <div className="flex flex-col gap-6 items-center">
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

    if (method === "admin-account") {
      return <LoginFormAccount onBack={handleBack} />;
    }

    const stepLabel =
      method === "user-vneid"
        ? "Bước 2: Đăng nhập bằng tài khoản định danh điện tử (VNeID)."
        : "Bước 2: Đăng nhập bằng Tài khoản cấp bởi Cổng dịch vụ công quốc gia.";

    return (
      <LoginFormVneid stepLabel={stepLabel} onBack={handleBack} />
    );
  }

  return (
    <LoginLayout>
      <Loading show={isLoading} />
      <div key={step} className="animate-fade-in-up">
        {renderStep()}
      </div>
    </LoginLayout>
  );
}
