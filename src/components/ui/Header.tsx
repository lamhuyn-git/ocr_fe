import { useState, useEffect } from "react";
import Icon from "../icons";
import Button from "./Button";
import Logo from "./Logo";
import drum from "../../assets/drum.svg";

const NAV_LINKS = ["Đăng ký tạm trú", "Tra cứu hồ sơ", "Hỗ trợ"];

export default function Header({ userName }: { userName: string }) {
  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Nav trong suốt khi ở đầu trang (đè lên hero xanh), có nền khi cuộn xuống.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                className={`text-para-s-semibold mt-[4px] ${
                  i === 0
                    ? "text-white"
                    : "text-grey-dark-hover hover:text-white "
                }`}
              >
                {link}
              </a>
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
            <span className="text-para-s-semibold mt-[2px]">Ngày {today}</span>
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="14px"
            className="gap-0 !p-2 [&_path]:stroke-grey-dark-hover"
            showIcon
            icon="notification"
          />
          <div className="flex items-center gap-2 bg-white rounded-full pl-1 pr-3 py-1">
            <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center">
              <Icon name="account" size={16} className="text-primary" />
            </div>
            <span className="text-para-s-semibold text-text-main">
              {userName}
            </span>
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
        <div className="relative z-10 px-10 pt-16 pb-12 max-w-[1400px] mx-auto w-full">
          <h1 className="font-serif text-heading-serif uppercase text-[2rem]">
            Hồ sơ đăng ký tạm trú
          </h1>
          <div className="mt-3 text-para-m-regular text-white/70 leading-relaxed">
            <p>
              Bạn đang đăng nhập bằng tài khoản công vụ Vui lòng điền đầy đủ
              thông tin để đăng nhập.
            </p>
            <p>Lưu ý: Các trường thông tin có (*) là các trường bắt buộc.</p>
          </div>
        </div>
      </div>
    </>
  );
}
