import { useState } from 'react';
import LoginProgressBar from './login-progress-bar';
import { UserIcon, LockIcon, EyeIcon } from './icons';
import qrCode from '../../../assets/qr-code.png';

type LoginFormVneidProps = {
  stepLabel: string;
};

export default function LoginFormVneid({ stepLabel }: LoginFormVneidProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="flex flex-col gap-14 items-center">
      {/* Header */}
      <div className="flex flex-col gap-2 items-center w-full">
        <h1 className="text-3xl font-bold text-text-main text-center leading-none">
          Đăng nhập
        </h1>
        <div className="flex flex-col gap-4 items-center w-full">
          <p className="text-sm font-normal text-text-main text-center whitespace-nowrap">
            {stepLabel}
          </p>
          <LoginProgressBar step={2} />
        </div>
      </div>

      {/* Form + QR side by side */}
      <div className="flex gap-10 items-start">
        {/* Left: form inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-end w-[527px]">
          {/* ID field */}
          <div className="w-full bg-white border border-input-border rounded-lg px-6 py-6 flex items-center gap-4">
            <UserIcon />
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Số định danh cá nhân"
              className="flex-1 text-sm text-text-main placeholder-text-placeholder leading-[1.45] min-w-0"
            />
          </div>

          {/* Password field */}
          <div className="w-full bg-white border border-input-border rounded-lg px-6 py-6 flex items-center gap-4">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="flex-1 text-sm text-text-main placeholder-text-placeholder leading-[1.45] min-w-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="shrink-0 w-6 h-6 flex items-center justify-center"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              <EyeIcon show={showPassword} />
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-light font-bold text-sm rounded-lg py-6 flex items-center justify-center leading-[1.45] hover:bg-[#356820] transition-colors"
          >
            Đăng nhập
          </button>

          {/* Help text */}
          <div className="flex gap-1 items-start w-full text-sm text-text-main text-center whitespace-nowrap">
            <span className="font-normal leading-[1.45]">
              *Trường hợp không đăng nhập được, vui lòng
            </span>
            <a href="#" className="font-bold leading-[1.45] underline">
              xem hướng dẫn
            </a>
            <span className="font-bold leading-[1.45]">.</span>
          </div>
        </form>

        {/* Divider */}
        <div className="self-stretch w-px bg-primary-light" />

        {/* Right: QR code */}
        <div className="flex flex-col gap-4 items-center justify-center h-full">
          <img src={qrCode} alt="QR code VNeID" className="w-[249px] h-[251px] object-cover" />
          <p className="text-sm text-black text-center leading-[1.45] w-[249px]">
            Hoặc quét mã QR này bằng ứng dụng VNeID để đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
}
