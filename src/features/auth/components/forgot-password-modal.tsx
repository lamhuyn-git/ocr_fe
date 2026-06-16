import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Loading from "../../../components/ui/Loading";
import { forgotPassword, verifyOtp, resetPassword } from "../services/auth-api";
import type { ApiError } from "../types";

type Step = "code" | "password";

type Props = {
  // Email cán bộ — luôn có sẵn (form bắt nhập email trước khi mở modal).
  email: string;
  onClose: () => void;
  onSuccess: () => void; // đổi mật khẩu xong → quay về trang login
};

function errMsg(e: unknown): string {
  return (e as ApiError)?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại.";
}

export default function ForgotPasswordModal({
  email,
  onClose,
  onSuccess,
}: Props) {
  const [step, setStep] = useState<Step>("code");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const autoSent = useRef(false);

  async function sendCode() {
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email.trim());
      setInfo(`Mã xác thực 6 số đã được gửi tới ${email.trim()}.`);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  // Tự gửi mã 1 lần khi mở modal (email đã chắc chắn có).
  useEffect(() => {
    if (autoSent.current) return;
    autoSent.current = true;
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleVerify() {
    if (!/^\d{6}$/.test(otp)) {
      setError("Mã xác thực gồm 6 chữ số.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(email.trim(), otp);
      setStep("password");
      setInfo(null);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (newPassword.length < 8) {
      setError("Mật khẩu mới tối thiểu 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email.trim(), otp, newPassword);
      onSuccess();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }

  const container = document.getElementById("auth-content") ?? document.body;
  return createPortal(
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-card flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h2 font-bold text-text-main">
              Cấp lại mật khẩu
            </h2>
            <p className="text-para-m-regular text-text-secondary leading-[1.5]">
              {step === "code" &&
                (info ?? "Nhập mã xác thực 6 số được gửi tới email của bạn.")}
              {step === "password" && "Đặt mật khẩu mới cho tài khoản."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Đóng"
            className="shrink-0 -mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-grey-hover disabled:cursor-not-allowed"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-2">
            <p className="text-para-m-regular text-red-600">{error}</p>
          </div>
        )}

        {step === "code" && (
          <Input
            inputType="default"
            placeholder="Mã xác thực 6 số"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />
        )}

        {step === "password" && (
          <div className="flex flex-col gap-3">
            <Input
              icon="lock"
              inputType="password"
              showSubIcon
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              icon="lock"
              inputType="password"
              showSubIcon
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {step === "code" && (
            <>
              <Button
                variant="primary"
                size="14px"
                text={loading ? "Đang kiểm tra..." : "Xác nhận"}
                className="w-full justify-center"
                disabled={loading || otp.length !== 6}
                onClick={handleVerify}
              />
              <Button
                variant="tertiary"
                size="12px"
                showIcon
                icon="reload"
                text="Gửi lại mã"
                className="w-fit self-center !text-grey-dark-hover [&_path]:stroke-current"
                disabled={loading}
                onClick={sendCode}
              />
            </>
          )}
          {step === "password" && (
            <Button
              variant="primary"
              size="14px"
              text={loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
              className="w-full justify-center"
              disabled={loading}
              onClick={handleReset}
            />
          )}
        </div>
      </div>

      {/* Loading overlay khi đang đặt lại mật khẩu */}
      {loading && step === "password" && <Loading show />}
    </div>,
    container,
  );
}
