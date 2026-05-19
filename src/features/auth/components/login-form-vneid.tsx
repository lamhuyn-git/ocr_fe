import { useState } from "react";
import qrCode from "../../../assets/design_link.png";
import Input from "../../../components/ui/Input";
import LoginProgressBar from "./login-progress-bar";
import Button from "../../../components/ui/Button";

type LoginFormVneidProps = {
  stepLabel: string;
};

export default function LoginFormVneid({ stepLabel }: LoginFormVneidProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-col gap-12 items-center">
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
          className="w-full flex flex-col gap-6 items-end"
        >
          {/* ID field */}
          <Input
            inputType="default"
            icon="account"
            placeholder="Số định danh cá nhân"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password field */}
          <Input
            inputType="password"
            icon="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showSubIcon={true}
          />

          {/* Login button */}
          <Button
            type="submit"
            size="14px"
            variant="primary"
            text="Đăng nhập"
            className="w-full"
          />

          {/* Help text */}
          <div className="flex gap-1 items-start w-full text-para-m-regular text-text-main text-center whitespace-nowrap">
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
