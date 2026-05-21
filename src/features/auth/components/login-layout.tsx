import { type ReactNode } from "react";
import Logo from "../../../components/ui/Logo";
import drumSvg from "../../../assets/drum.svg";

type LoginLayoutProps = {
  children: ReactNode;
};

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col font-be-vietnam ">
      {/* Logo — top left */}
      <header className="relative z-10 px-8 py-4">
        <Logo size="Large" showText />
      </header>

      {/* Centered popup card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="min-w-[35%] bg-white/10 border border-primary-light rounded-card shadow-card px-8 pt-16 pb-8 mb-[4rem]">
          {children}
        </div>
      </main>

      {/* Footer — drum watermark sits behind the text row */}
      <footer className="relative z-10 px-8 py-4 overflow-hidden">
        {/* Trống Đồng — decorative watermark centered behind footer content */}
        <img
          src={drumSvg}
          alt=""
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[6%] w-[68rem] h-[68rem] pointer-events-none select-none"
        />

        {/* Decorative lines (before/after) flanking the footer text */}
        <div
          className="
            relative flex items-center gap-8 
            before:content-[''] before:flex-1 before:h-px before:bg-beige-active
            after:content-['']  after:flex-1  after:h-px  after:bg-beige-active
          "
        >
          <p className="shrink-0 max-w-[480px] text-[0.65rem] text-text-main text-center leading-[1.45]">
            This product is developed solely for demonstration and testing
            purposes, and is not intended for any commercial or
            profit-generating activities.
          </p>
        </div>
      </footer>
    </div>
  );
}
