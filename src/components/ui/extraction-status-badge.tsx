import {
  EXTRACTION_STATUS_CONFIG,
  type ExtractionStatus,
} from "../../features/form-detail/types";

// Badge kiểu chấm tròn cho trạng thái kiểm tra từng mục trích xuất.
export default function ExtractionStatusBadge({
  status,
}: {
  status: ExtractionStatus;
}) {
  const cfg = EXTRACTION_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <span className="text-para-s-semibold">{cfg.label}</span>
    </span>
  );
}
