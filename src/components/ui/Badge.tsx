// Badge pill (style giống Status) cho kết quả kiểm tra trích xuất: 3 state.
export type BadgeStatus = "valid" | "invalid" | "need_review";

type BadgeStyle = { label: string; className: string };

const BADGE_CONFIG: Record<BadgeStatus, BadgeStyle> = {
  valid: { label: "Hợp lệ", className: "bg-secondary text-white" },
  invalid: { label: "Không hợp lệ", className: "bg-red text-white" },
  need_review: {
    label: "Cần xem xét",
    className: "bg-yellow-light text-yellow-hover",
  },
};

type BadgeProps = {
  status: BadgeStatus;
  className?: string;
};

export default function Badge({ status, className }: BadgeProps) {
  const { label, className: colorClass } = BADGE_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-para-s-semibold ${colorClass} ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
