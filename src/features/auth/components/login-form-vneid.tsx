import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useAuth } from "../hooks/use-auth";

type LoginFormVneidProps = {
  stepLabel: string;
  onGoogleLogin?: () => void;
};

export default function LoginFormVneid({ stepLabel }: LoginFormVneidProps) {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    nationalId?: string;
    password?: string;
  }>({});
  const [apiErrorOnFields, setApiErrorOnFields] = useState(false);

  const { signInWithVneid, isLoading, error, clearError } = useAuth();

  function validate(): boolean {
    const errors: { nationalId?: string; password?: string } = {};
    if (!nationalId.trim()) errors.nationalId = "Vui lòng nhập số định danh.";
    if (!password) errors.password = "Vui lòng nhập mật khẩu.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiErrorOnFields(false);
    if (!validate()) return;
    clearError();
    const apiError = await signInWithVneid({
      nationalId: nationalId.trim(),
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

      {/* Form — một cột dọc */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-4 items-end"
        noValidate
      >
        <Input
          inputType="default"
          icon="account"
          placeholder="Số định danh cá nhân"
          value={nationalId}
          error={fieldErrors.nationalId}
          hasError={apiErrorOnFields}
          onChange={(e) => {
            setNationalId(e.target.value);
            setFieldErrors((p) => ({ ...p, nationalId: undefined }));
            setApiErrorOnFields(false);
          }}
        />

        <Input
          inputType="password"
          icon="lock"
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
          className="w-full justify-center"
          disabled={isLoading}
        />

        {/* <Button
          type="button"
          variant="tertiary"
          size="12px"
          text="Quên mật khẩu?"
          onClick={() => {
            console.log("Reset password button clicked");
          }}
          className="text-para-m-semibold"
          style={{
            padding: 0,
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: "#242424",
          }}
        /> */}
      </form>

      {/* Phương thức khác — đăng nhập Google (demo) */}
      {/* <div className="flex flex-col gap-4 w-full">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-[42%]">
            <span className="text-h3 font-bold text-text-main leading-none">
              Phương thức khác
            </span>
            <p className="text-para-m-regular font-normal text-text-secondary leading-[1.45]">
              Đăng nhập bằng Google để trải nghiệm bản demo mã nguồn mở của
              Vextract với vai trò là citizen.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoogleLogin}
            className="shrink-0 flex items-center gap-3 rounded-lg bg-grey px-5 py-3 text-para-m-semibold text-text-secondary transition-colors hover:bg-grey-hover"
          >
            <GoogleLogo />
            Đăng nhập với Google
          </button>
        </div>
        <hr className="border-grey-hover" />
      </div> */}
    </div>
  );
}
