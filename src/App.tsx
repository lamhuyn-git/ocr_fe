import { useState } from 'react';
import LoginPage from './components/login/login-page';
import LoginMethodSelect, { type LoginMethod } from './components/login/login-method-select';
import LoginFormVneid from './components/login/login-form-vneid';
import LoginFormAccount from './components/login/login-form-account';

type LoginStep = 1 | 2;

export default function App() {
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

    if (method === 'officer-account') {
      return <LoginFormAccount />;
    }

    const stepLabel =
      method === 'citizen-vneid'
        ? 'Bước 2: Đăng nhập bằng tài khoản định danh điện tử (VNeID).'
        : 'Bước 2: Đăng nhập bằng tài khoản định danh điện tử (VNeID).';

    return <LoginFormVneid stepLabel={stepLabel} />;
  }

  return (
    <LoginPage>
      {renderStep()}
    </LoginPage>
  );
}
