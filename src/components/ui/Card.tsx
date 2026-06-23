import type { ReactNode } from "react";

// Khung 1 section. active -> khung xanh + header trắng; còn lại -> xám nhạt.
export default function Card({
  title,
  active = false,
  children,
}: {
  title: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl p-[0.125rem] ${
        active ? "bg-main border border-primary" : "bg-main-light"
      }`}
    >
      <div
        className={`px-6 pt-3 pb-5 ${
          active ? "text-white" : "text-text-secondary"
        }`}
      >
        <span className="text-para-m-semibold uppercase tracking-[0.02em]">
          {title}
        </span>
      </div>
      {/* Body trắng bo tròn, tụt lên để màu khung lộ ở các góc */}
      <div className="-mt-2 rounded-2xl bg-white px-6 py-6">{children}</div>
    </section>
  );
}
