import { type ReactNode } from 'react';
import vextractLogo from '../../assets/vextract-logo.svg';

// Subtle decorative wave pattern matching the Figma background (Trống Đồng motif)
function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Bottom-left wave cluster */}
      <svg
        className="absolute bottom-0 left-0 w-[480px] opacity-20"
        viewBox="0 0 480 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="120" cy="280" rx="200" ry="80" stroke="#3F7B28" strokeWidth="1.5" fill="none" />
        <ellipse cx="120" cy="280" rx="160" ry="60" stroke="#3F7B28" strokeWidth="1.2" fill="none" />
        <ellipse cx="120" cy="280" rx="120" ry="40" stroke="#3F7B28" strokeWidth="1" fill="none" />
        <ellipse cx="120" cy="280" rx="80" ry="24" stroke="#3F7B28" strokeWidth="0.8" fill="none" />
        <path d="M0 240 Q60 220 120 240 Q180 260 240 240" stroke="#3F7B28" strokeWidth="1" fill="none" />
        <path d="M0 260 Q80 240 160 260 Q240 280 320 260" stroke="#3F7B28" strokeWidth="0.8" fill="none" />
        <path d="M20 290 Q100 270 180 290 Q260 310 340 290" stroke="#3F7B28" strokeWidth="0.6" fill="none" />
      </svg>

      {/* Bottom-right wave cluster */}
      <svg
        className="absolute bottom-0 right-0 w-[520px] opacity-20"
        viewBox="0 0 520 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="400" cy="300" rx="220" ry="90" stroke="#3F7B28" strokeWidth="1.5" fill="none" />
        <ellipse cx="400" cy="300" rx="175" ry="68" stroke="#3F7B28" strokeWidth="1.2" fill="none" />
        <ellipse cx="400" cy="300" rx="130" ry="46" stroke="#3F7B28" strokeWidth="1" fill="none" />
        <ellipse cx="400" cy="300" rx="85" ry="26" stroke="#3F7B28" strokeWidth="0.8" fill="none" />
        <path d="M200 260 Q300 240 400 260 Q480 280 520 260" stroke="#3F7B28" strokeWidth="1" fill="none" />
        <path d="M180 285 Q290 265 400 285 Q490 305 520 285" stroke="#3F7B28" strokeWidth="0.8" fill="none" />
      </svg>

      {/* Top-left subtle arcs */}
      <svg
        className="absolute top-24 left-16 w-64 opacity-10"
        viewBox="0 0 256 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 80 Q64 20 128 80 Q192 140 256 80" stroke="#3F7B28" strokeWidth="1.5" fill="none" />
        <path d="M0 100 Q64 40 128 100 Q192 160 256 100" stroke="#3F7B28" strokeWidth="1" fill="none" />
        <path d="M0 60 Q64 0 128 60 Q192 120 256 60" stroke="#3F7B28" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  );
}

type LoginPageProps = {
  children: ReactNode;
};

export default function LoginPage({ children }: LoginPageProps) {
  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col font-be-vietnam">
      <BackgroundDecoration />

      {/* Logo — top left */}
      <header className="relative z-10 p-8">
        <div className="flex items-center gap-1">
          <img src={vextractLogo} alt="VExtract logo" className="w-12 h-12" />
          <span className="font-extrabold text-base text-text-main tracking-[0.32px]">
            VExtract
          </span>
        </div>
      </header>

      {/* Centered popup card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="bg-white/10 border border-primary-light rounded-card shadow-card px-8 pt-16 pb-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-text-placeholder leading-[1.45]">
          This product is developed solely for demonstration and testing purposes, and is not intended for any commercial or profit-generating activities.
        </p>
      </footer>
    </div>
  );
}
