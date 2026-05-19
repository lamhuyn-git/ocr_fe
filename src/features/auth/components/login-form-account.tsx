import { useState } from "react";
import LoginProgressBar from "./login-progress-bar";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function LoginFormAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  function handleRequestNewPassword() {}

  return (
    <div className="flex flex-col gap-14 items-center">
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 items-end w-full"
      >
        <Input
          icon="account"
          inputType="default"
          placeholder="Số định danh cá nhân"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          icon="password"
          inputType="password"
          showSubIcon
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="primary"
          size="14px"
          text="Đăng nhập"
          className="w-full justify-center"
        />

        <Button
          type="button"
          variant="secondary"
          size="14px"
          text="Yêu cầu cấp lại mật khẩu"
          className="w-full justify-center"
          onClick={handleRequestNewPassword}
        />

        {/* Help text */}
        <div className="flex gap-1 items-start w-full text-para-m-regular text-text-main text-center whitespace-nowrap">
          <span className="text-para-m-regular">
            *Trường hợp không đăng nhập được, vui lòng
          </span>
          <a href="#" className="text-para-m-semibold">
            xem hướng dẫn
          </a>
          <span className="font-bold leading-[1.45]">.</span>
        </div>
      </form>
    </div>
  );
}
