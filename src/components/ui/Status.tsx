// Trạng thái workflow của hồ sơ
export type FormStatusKey =
  | "draft"
  | "submitted"
  | "processing"
  | "extracted"
  | "under_review"
  | "reviewed"
  | "returned"
  | "approved"
  | "rejected"
  | "failed"
  | "overdue";

type FormStatusStyle = { label: string; className: string };

export const FORM_STATUS_CONFIG: Record<FormStatusKey, FormStatusStyle> = {
  draft: {
    label: "Bản nháp",
    className: "bg-grey-hover text-text-placeholder",
  },
  submitted: {
    label: "Đã tiếp nhận",
    className: "bg-beige-light-active text-beige-darker",
  },
  processing: {
    label: "Đang trích xuất",
    className: "bg-blue-light text-blue",
  },
  extracted: {
    label: "Đã trích xuất",
    className: "bg-secondary-light text-secondary",
  },
  under_review: {
    label: "Đang xem xét",
    className: "bg-yellow-light text-yellow-hover",
  },
  reviewed: {
    label: "Đã xem",
    className: "bg-[#f1ecfc] text-[#6d5bd0]",
  },
  returned: {
    label: "Đã trả kết quả",
    className: "bg-secondary text-white",
  },
  approved: {
    label: "Hợp lệ",
    className: "bg-secondary text-white",
  },
  rejected: {
    label: "Không hợp lệ",
    className: "bg-red text-white",
  },
  failed: {
    label: "Lỗi",
    className: "bg-red-light text-red",
  },
  overdue: {
    label: "Quá hạn",
    className: "bg-grey-hover text-text-placeholder",
  },
};

type FormStatusProps = {
  status: string;
  className?: string;
};

export default function Status({ status, className }: FormStatusProps) {
  const { label, className: colorClass } = FORM_STATUS_CONFIG[
    status as FormStatusKey
  ] ?? {
    label: status,
    className: "bg-grey-hover text-text-placeholder",
  };

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-para-m-semibold ${colorClass} ${className ?? ""}`}
    >
      {label}
    </span>
  );
}
