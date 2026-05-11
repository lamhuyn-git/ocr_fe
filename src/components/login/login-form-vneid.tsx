import { useState } from 'react';
import LoginProgressBar from './login-progress-bar';
import qrCode from '../../assets/qr-code.png';

// SVG icons inline to avoid extra deps
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 18C2 15.2386 5.58172 13 10 13C14.4183 13 18 15.2386 18 18" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="9" width="14" height="10" rx="2" stroke="#707071" strokeWidth="1.5"/>
      <path d="M7 9V6C7 3.79086 8.79086 2 11 2V2C13.2091 2 15 3.79086 15 6V9" stroke="#707071" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14" r="1.5" fill="#707071"/>
    </svg>
  );
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 10C1 10 4 4 10 4C16 4 19 10 19 10C19 10 16 16 10 16C4 16 1 10 1 10Z" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="10" r="2.5" stroke="#707071" strokeWidth="1.5"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L17 17M8.46 8.46A2.5 2.5 0 0012.54 12.54M6.35 5.35C4.31 6.6 2.7 8.6 2 10c1.5 3.5 5 6 8 6a8.5 8.5 0 004.65-1.35M10 4c3 0 6.5 2.5 8 6a9.5 9.5 0 01-1.65 2.65" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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
