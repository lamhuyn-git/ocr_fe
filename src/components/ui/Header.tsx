import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../icons";
import Button from "./Button";
import Logo from "./Logo";
import drum from "../../assets/drum.svg";
import { useAuthContext } from "../../store/auth-store";

const NAV_LINKS: { label: string; to: string }[] = [
  { label: "Đăng ký tạm trú", to: "/form" },
  { label: "Tra cứu hồ sơ", to: "/lookup" },
  { label: "Hỗ trợ", to: "#" },
];

type HeaderProps = {
  userName: string;
  title?: string;
  subtitle?: ReactNode;
  activeNav?: string;
};

export default function Header({
  userName,
  title = "Hồ sơ đăng ký tạm trú",
  subtitle,
  activeNav = "Đăng ký tạm trú",
}: HeaderProps) {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Nav trong suốt khi ở đầu trang (đè lên hero xanh), chỉ có nền khi cuộn xuống.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { signOut } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex items-center justify-between px-20 py-4 text-white transition-colors duration-200 ${
          scrolled ? "bg-main shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-8">
          <Logo size="Medium" showText className="text-white" />
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => link.to !== "#" && navigate(link.to)}
                className={`text-para-m-semibold mt-[0.15rem] ${
                  link.label === activeNav
                    ? "text-white"
                    : "text-grey-dark-hover hover:text-white "
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-grey-dark-hover">
            <Icon
              name="calendar"
              size={20}
              className="[&_path]:stroke-grey-dark-hover"
            />
            <span className="text-para-m-semibold mt-[0.125rem]">
              Ngày {today}
            </span>
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="14px"
            className="gap-0 !p-2 [&_path]:stroke-grey-dark-hover"
            showIcon
            icon="notification"
          />
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1"
            >
              <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center">
                <Icon name="account" size={16} className="text-primary" />
              </div>
              <span className="text-para-m-semibold text-text-main">
                {userName}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-card z-50 py-2">
                <Button
                  type="button"
                  variant="tertiary"
                  size="12px"
                  text="Đăng xuất"
                  showIcon
                  icon="logout"
                  onClick={() => {
                    setMenuOpen(false);
                    void signOut().catch(() => {});
                  }}
                  className="w-full flex items-center !justify-start gap-2 w-full px-4 py-2 text-para-m-medium text-primary [&_path]:stroke-primary hover:bg-grey transition-colors"
                />
                <Button
                  type="button"
                  variant="tertiary"
                  size="12px"
                  text="Cài đặt"
                  showIcon
                  icon="setting"
                  className="w-full flex items-center !justify-start gap-2 w-full px-4 py-2 text-para-m-medium text-primary [&_path]:stroke-primary hover:bg-grey transition-colors"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden bg-main text-white -mt-16 pt-16">
        <img
          src={drum}
          alt=""
          aria-hidden
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80rem] opacity-15"
        />
        <div className="relative z-10 px-10 pt-16 pb-12 max-w-[87.5rem] mx-auto w-full">
          <h1 className="font-serif text-heading-serif uppercase text-[2rem]">
            {title}
          </h1>
          <div className="mt-3 text-para-m-regular text-white/70 leading-relaxed ">
            {subtitle ?? (
              <>
                <p>
                  Khai và nộp hồ sơ đăng ký tạm trú trực tuyến. Vui lòng kiểm
                  tra, điền đầy đủ và chính xác các thông tin bên dưới trước khi
                  nộp.
                </p>
                <p className="mt-1">
                  Thông tin cá nhân được tự động lấy từ Cơ sở dữ liệu quốc gia
                  về dân cư. Các trường có dấu{" "}
                  <span className="font-semibold text-white">(*)</span> là bắt
                  buộc phải điền.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
