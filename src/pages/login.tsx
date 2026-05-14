import { useState } from "react";
import LoginLayout from "../features/auth/components/login-layout";
import LoginMethodSelect from "../features/auth/components/login-method-select";
import LoginFormVneid from "../features/auth/components/login-form-vneid";
import LoginFormAccount from "../features/auth/components/login-form-account";
import { type LoginMethod, type LoginStep } from "../features/auth/hooks/types";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>(1);
  const [method, setMethod] = useState<LoginMethod | null>(null);

  function handleMethodSelect(selected: LoginMethod) {
    setMethod(selected);
    setStep(2);
  }

  function renderStep() {
    if (step === 1 || method === null) {
      return <LoginMethodSelect onSelect={handleMethodSelect} />;
    }

    if (method === "officer-account") {
      return <LoginFormAccount />;
    }

    const stepLabel =
      "Bước 2: Đăng nhập bằng tài khoản định danh điện tử (VNeID).";

    return <LoginFormVneid stepLabel={stepLabel} />;
  }

  return <LoginLayout>{renderStep()}</LoginLayout>;
}
