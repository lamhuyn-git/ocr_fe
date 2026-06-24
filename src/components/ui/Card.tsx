import type { ReactNode } from "react";

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
      <div className="-mt-2 rounded-2xl bg-white px-6 py-6">{children}</div>
    </section>
  );
}
