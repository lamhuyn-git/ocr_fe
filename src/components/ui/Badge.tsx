import {
  EXTRACTION_STATUS_CONFIG,
  type ExtractionStatus,
} from "../../features/form-detail/types";

// Badge pill (chấm tròn + nhãn) cho trạng thái kiểm tra trích xuất: 3 state.
type BadgeProps = {
  status: ExtractionStatus;
  className?: string;
};

export default function Badge({ status, className }: BadgeProps) {
  const cfg = EXTRACTION_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} ${className ?? ""}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <span className="text-para-m-semibold">{cfg.label}</span>
    </span>
  );
}
