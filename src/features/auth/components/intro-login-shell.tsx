import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../components/ui/Logo";
import Icon from "../../../components/icons";
import drum from "../../../assets/drum.svg";

// Mục điều hướng ở sidebar (Giới thiệu / Đăng nhập).
const NAV_ITEMS = [
  {
    to: "/introduction",
    title: "Giới Thiệu",
    subtitle: "Đôi lời giới thiệu về website",
  },
  {
    to: "/login",
    title: "Đăng Nhập",
    subtitle: "Đăng nhập để sử dụng dịch vụ",
  },
];

type Props = {
  children: ReactNode;
  // Thanh trên cùng bên phải: chấm bước + nút Trở lại/Tiếp theo.
  dotCount?: number;
  dotIndex?: number;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
};

// Khung 2 cột dùng chung cho trang Giới thiệu & Đăng nhập:
// sidebar xanh đậm bên trái + vùng nội dung trắng bên phải (có watermark núi).
export default function IntroLoginShell({
  children,
  dotCount = 4,
  dotIndex = 0,
  onBack,
  onNext,
  nextLabel = "Tiếp theo",
  backLabel = "Trở lại",
}: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="h-svh overflow-hidden w-full bg-[#e8eae9] font-be-vietnam">
      <div className="flex h-full gap-4 bg-white p-2 shadow-card">
        {/* Sidebar */}
        <aside className="relative overflow-hidden flex w-[18%] shrink-0 flex-col rounded-[22px] bg-main px-6 py-7 text-white">
          <Logo size="Large" showText className="text-white mb-10" />

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.to;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate(item.to)}
                  className={`flex flex-col gap-1 rounded-xl px-4 py-3 text-left transition-colors ${
                    active ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-para-m-semibold text-white">
                    {item.title}
                  </span>
                  <span className="text-para-s-regular text-white/45">
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </nav>

          <img
            src={drum}
            alt=""
            aria-hidden
            className="pointer-events-none select-none absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-[35rem] opacity-15"
          />
        </aside>

        {/* Content */}
        <section
          id="auth-content"
          className="relative flex flex-1 flex-col overflow-hidden rounded-[22px] py-4 pr-4"
        >
          {/* Top bar: chấm bước + điều hướng */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: dotCount }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === dotIndex ? "w-6 bg-main" : "w-1.5 bg-main/25"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 text-para-s-medium text-text-secondary">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1 hover:text-text-main transition-colors"
                >
                  <Icon name="chevron-left" size={16} />
                  {backLabel}
                </button>
              )}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="flex items-center gap-1 hover:text-text-main transition-colors"
                >
                  {nextLabel}
                  <Icon name="chevron-right" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Watermark núi line-art ở đáy */}

          {/* Nội dung trang */}
          <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        </section>
      </div>
    </div>
  );
}
