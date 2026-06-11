import type { ReactNode } from "react";

export default function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <span className="text-para-s-semibold text-text-main">
      {children}
      {required && " (*)"}
    </span>
  );
}
