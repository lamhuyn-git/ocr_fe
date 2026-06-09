import { useState } from "react";
import LoginProgressBar from "./login-progress-bar";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useAuth } from "../hooks/use-auth";

type LoginFormAccountProps = {
  onBack: () => void;
};

export default function LoginFormAccount({ onBack }: LoginFormAccountProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [apiErrorOnFields, setApiErrorOnFields] = useState(false);

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

  function handleRequestNewPassword() {
    console.log("Request new password button clicked");
  }

  return (
    <div className="relative flex flex-col gap-10 items-center">
      <Button
        type="button"
        variant="tertiary"
        size="14px"
        text="Quay lại"
        showIcon
        icon="chevron-left"
        onClick={onBack}
        style={{ position: "absolute", top: "-14%", left: "-2%" }}
      />

      {/* Header */}
      <div className="flex flex-col gap-2 items-center w-full">
        <p className="text-h1 font-bold text-text-main text-center leading-none">
          Đăng nhập
        </p>
        <div className="flex flex-col gap-4 items-center w-full">
          <p className="text-para-m-regular font-normal text-text-main text-center">
            Bước 2: Đăng nhập bằng Tài khoản cấp bởi Cổng dịch vụ công quốc gia.
          </p>
          <LoginProgressBar step={2} />
        </div>
      </div>

      {/* API error banner */}
      {error && (
        <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-para-m-regular text-red-600">{error}</p>
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

        {/* <Button
          type="button"
          variant="secondary"
          size="14px"
          text="Yêu cầu cấp lại mật khẩu"
          className="w-full justify-center"
          onClick={handleRequestNewPassword}
          disabled={isLoading}
        /> */}

        <div className="flex mt-2 gap-1 items-start justify-between w-full text-para-m-regular text-text-main whitespace-nowrap">
          <a
            href="#"
            className="text-para-m-regular color-grey-hover underline "
          >
            Xem hướng dẫn đăng nhập
          </a>
          <Button
            type="button"
            variant="tertiary"
            size="12px"
            text="Quên mật khẩu?"
            onClick={handleRequestNewPassword}
            className="text-para-m-semibold "
            style={{
              padding: 0,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#242424",
            }}
          />
        </div>
      </form>
    </div>
  );
}
