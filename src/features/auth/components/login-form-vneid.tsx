import { useState } from "react";
import qrCode from "../../../assets/design_link.png";
import Input from "../../../components/ui/Input";
import LoginProgressBar from "./login-progress-bar";
import Button from "../../../components/ui/Button";
import { useAuth } from "../hooks/use-auth";

type LoginFormVneidProps = {
  stepLabel: string;
  method: "citizen-vneid" | "officer-vneid";
  onBack: () => void;
};

export default function LoginFormVneid({
  stepLabel,
  method,
  onBack,
}: LoginFormVneidProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [apiErrorOnFields, setApiErrorOnFields] = useState(false);

  const { signInWithVneid, isLoading, error, clearError } = useAuth();

  function validate(): boolean {
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) errors.username = "Vui lòng nhập số định danh.";
    if (!password) errors.password = "Vui lòng nhập mật khẩu.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiErrorOnFields(false);
    if (!validate()) return;
    clearError();
    const apiError = await signInWithVneid({ username: username.trim(), password, method });
    if (apiError) setApiErrorOnFields(true);
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
          <p className="text-para-m-regular font-normal text-text-main text-center whitespace-nowrap">
            {stepLabel}
          </p>
          <LoginProgressBar step={2} />
        </div>
      </div>

      {/* Form + QR side by side */}
      <div className="flex gap-10 items-start">
        {/* Left: form inputs */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 items-end"
          noValidate
        >
          <Input
            inputType="default"
            icon="account"
            placeholder="Số định danh cá nhân"
            value={username}
            error={fieldErrors.username}
            hasError={apiErrorOnFields}
            onChange={(e) => {
              setUsername(e.target.value);
              setFieldErrors((p) => ({ ...p, username: undefined }));
              setApiErrorOnFields(false);
            }}
          />

          <Input
            inputType="password"
            icon="password"
            placeholder="Mật khẩu"
            value={password}
            error={fieldErrors.password}
            hasError={apiErrorOnFields}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((p) => ({ ...p, password: undefined }));
              setApiErrorOnFields(false);
            }}
            showSubIcon
          />
          {/* API error banner */}
          {error && (
            <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-2">
              <p className="text-para-m-regular text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="14px"
            variant="primary"
            text="Đăng nhập"
            className="w-full"
            disabled={isLoading}
          />

          <div className="flex gap-1 items-start w-full text-para-m-regular text-text-main whitespace-nowrap">
            <span className="text-para-m-regular">
              *Trường hợp không đăng nhập được, vui lòng
            </span>
            <a href="#" className="text-para-m-semibold underline">
              xem hướng dẫn
            </a>
            <span className="font-bold leading-[1.45]">.</span>
          </div>
        </form>

        {/* Divider */}
        <div className="self-stretch w-px bg-primary-light" />

        {/* Right: QR code */}
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <img src={qrCode} alt="QR code for VNeID login" className="w-48" />
          <p className="text-para-m-regular w-full text-center">
            Hoặc quét mã QR này bằng ứng dụng VNeID để đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
}
