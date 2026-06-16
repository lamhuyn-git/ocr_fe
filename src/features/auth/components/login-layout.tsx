import { type ReactNode } from "react";
import IntroLoginShell from "./intro-login-shell";

type LoginLayoutProps = {
  children: ReactNode;
  // Nút "Trở lại" trên topbar (đồng bộ với bước đăng nhập); bỏ trống ở bước 1.
  onBack?: () => void;
  // Chấm bước hiện tại trên topbar (mặc định 1 = bước chọn phương thức).
  dotIndex?: number;
};

// Khung trang Đăng nhập — dùng chung shell 2 cột với trang Giới thiệu.
export default function LoginLayout({
  children,
  onBack,
  dotIndex = 1,
}: LoginLayoutProps) {
  return (
    <IntroLoginShell dotIndex={dotIndex} onBack={onBack}>
      {/* Wrapper chỉ căn giữa theo chiều dọc; width do từng bước (children) tự set. */}
      <div className="mx-auto flex w-full flex-1 flex-col justify-center">
        {children}
      </div>
    </IntroLoginShell>
  );
}
