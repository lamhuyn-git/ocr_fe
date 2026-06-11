import type { ReactNode } from "react";

type Variant = "primary" | "default";

export default function Card({
  title,
  variant = "default",
  children,
}: {
  title: string;
  variant?: Variant;
  children: ReactNode;
}) {
  const isPrimary = variant === "primary";

  return (
    // Nền card màu (xanh/xám) lộ ra quanh body trắng bo tròn.
    <section
      className={`rounded-2xl p-[2px] ${
        isPrimary ? "bg-main border border-primary" : "bg-main-light"
      }`}
    >
      <div
        className={`px-6 pt-3 pb-5 ${
          isPrimary ? "text-white" : "text-text-secondary"
        }`}
      >
        <span className="text-para-s-semibold uppercase tracking-[0.02em]">
          {title}
        </span>
      </div>
      {/* Body trắng bo tròn, tụt lên để màu nền lộ ở các góc bo */}
      <div className="-mt-2 rounded-2xl bg-white px-6 py-6">{children}</div>
    </section>
  );
}
