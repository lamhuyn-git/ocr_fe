import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import ForgotPasswordModal from "./forgot-password-modal";
import { useAuth } from "../hooks/use-auth";

type LoginFormAccountProps = {
  stepLabel: string;
};

export default function LoginFormAccount({ stepLabel }: LoginFormAccountProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [apiErrorOnFields, setApiErrorOnFields] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const { signInWithAccount, isLoading, error, clearError } = useAuth();

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Vui lòng nhập email.";
    if (!password) errors.password = "Vui lòng nhập mật khẩu.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiErrorOnFields(false);
    if (!validate()) return;
    clearError();
    const apiError = await signInWithAccount({
      email: email.trim(),
      password,
    });
    if (apiError) setApiErrorOnFields(true);
  }

  return (
    <div className="mx-auto w-full max-w-[37%] flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 w-full">
        <h1 className="text-heading-serif text-[1.7rem] font-serif uppercase text-text-main">
          Đăng nhập — Xác minh thông tin
        </h1>
        <p className="text-para-m-regular font-normal text-text-secondary leading-[1.6]">
          {stepLabel} Trường hợp không đăng nhập được, vui lòng{" "}
          <a href="#" className="font-semibold underline text-text-main">
            xem hướng dẫn
          </a>
          .
        </p>
      </div>

      {/* API error banner */}
      {error && (
        <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-para-m-regular text-red-600">{error}</p>
        </div>
      )}

      {/* Đặt lại mật khẩu thành công → mời đăng nhập lại bằng mật khẩu mới */}
      {resetDone && (
        <div className="w-full rounded-lg bg-secondary-light border border-secondary-light-active px-4 py-3">
          <p className="text-para-m-regular text-secondary-dark">
            Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-end w-full"
        noValidate
      >
        <Input
          icon="account"
          inputType="default"
          placeholder="Email"
          value={email}
          error={fieldErrors.email}
          hasError={apiErrorOnFields}
          onChange={(e) => {
            setEmail(e.target.value);
            setFieldErrors((p) => ({ ...p, email: undefined }));
            setApiErrorOnFields(false);
          }}
        />

        <Input
          icon="lock"
          inputType="password"
          showSubIcon
          placeholder="Mật khẩu"
          value={password}
          error={fieldErrors.password}
          hasError={apiErrorOnFields}
          onChange={(e) => {
            setPassword(e.target.value);
            setFieldErrors((p) => ({ ...p, password: undefined }));
            setApiErrorOnFields(false);
          }}
        />

        <Button
          type="submit"
          variant="primary"
          size="14px"
          text={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          className="w-full justify-center"
          disabled={isLoading}
        />

        <Button
          type="button"
          variant="secondary"
          size="14px"
          showIcon
          icon="reload"
          text="Yêu cầu cấp lại mật khẩu"
          className="w-full justify-center"
          onClick={() => {
            if (!email.trim()) {
              setFieldErrors((p) => ({ ...p, email: "Vui lòng nhập email." }));
              return;
            }
            setResetDone(false);
            setShowForgot(true);
          }}
          disabled={isLoading}
        />
      </form>

      {showForgot && (
        <ForgotPasswordModal
          email={email}
          onClose={() => setShowForgot(false)}
          onSuccess={() => {
            setShowForgot(false);
            setResetDone(true);
            setPassword("");
          }}
        />
      )}
    </div>
  );
}
