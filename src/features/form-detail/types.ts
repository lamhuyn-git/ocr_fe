export type ExtractionStatus = "valid" | "invalid" | "review";

export const EXTRACTION_STATUS_CONFIG: Record<
  ExtractionStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  valid: {
    label: "Hợp lệ",
    dot: "bg-secondary",
    bg: "bg-secondary-light",
    text: "text-secondary",
  },
  invalid: {
    label: "Không hợp lệ",
    dot: "bg-red",
    bg: "bg-red-light",
    text: "text-red",
  },
  review: {
    label: "Cần xem",
    dot: "bg-yellow",
    bg: "bg-yellow-light",
    text: "text-yellow-hover",
  },
};

export type ProcedureInfo = {
  hinhThuc: string;
  truongHop: string;
  nguoiKhai?: string;
};

// Cặp nhãn - giá trị dùng chung.
export type LabelValue = { label: string; value: string };

// Mục accordion ở panel trái ("Thông tin điền online").
export type OnlineInfoSection = {
  id: string;
  title: string;
  rows: LabelValue[];
};

// 1 field trong panel phải ("Kết quả trích xuất"): giá trị hệ thống trích xuất
// + giá trị BE đề xuất (suggest) + kết quả kiểm tra. Ứng 1-1 với field online.
export type ExtractionField = {
  id: string;
  label: string;
  value: string; // giá trị hệ thống trích xuất (hiển thị chính)
  suggestValue?: string; // "Gần nhất" - BE đề xuất (hiện khi có)
  status: ExtractionStatus;
  checkResult: string; // vd: "Khớp với CSDL"
  historyCount: number;
  position?: number[] | null; // bbox [x, y, width, height] trên ảnh CT01 (để vẽ box)
  confirmedBy?: string | null; // id cán bộ đã chốt field (có -> ẩn nút hành động)
  confirmedByEmail?: string | null; // email cán bộ đã chốt (để hiển thị)
};

// Nhóm extraction theo section (id khớp onlineSections) -> panel phải chỉ hiện
// field của section đang chọn bên trái.
export type ExtractionSection = {
  id: string;
  title: string;
  fields: ExtractionField[];
};

// Kết quả đánh dấu 1 field (valid / invalid) — lưu trước khi submit.
export type SaveChangeFieldItem = {
  id: string; // field.id (UUID)
  status: "valid" | "invalid";
};

// Thành viên trong hộ cùng thay đổi (mục 11 của tờ khai).
export type HouseholdMember = {
  order: number;
  fullName: string;
  birthday: string;
  gender: string;
  nationalId: string;
  relationship: string;
};

// Dữ liệu tờ khai CT01 hiển thị ở giữa.
export type FormDeclaration = {
  recipient: string;
  fullName: string;
  birthday: string;
  gender: string;
  nationalId: string;
  phone: string;
  email: string;
  ownerName: string;
  ownerRelationship: string;
  ownerNationalId: string;
  requestContent: string;
  members: HouseholdMember[];
};

// Ảnh minh chứng đã nộp (tờ khai CT01 + giấy tờ đính kèm).
export type EvidenceImage = {
  id: string;
  url: string;
  isCt01: boolean; // true: ảnh tờ khai CT01; false: giấy tờ đính kèm khác
};

// Tổng hợp dữ liệu của trang chi tiết hồ sơ.
export type FormDetail = {
  code: string;
  submittedDate: string;
  statusLabel: string;
  procedure: ProcedureInfo;
  onlineSections: OnlineInfoSection[];
  extractionSections: ExtractionSection[];
  checkedFields: number;
  totalFields: number;
  declaration: FormDeclaration;
  evidences: EvidenceImage[];
  reviewNote: string | null; // ghi chú duyệt (hiện khi chưa có kết quả trích xuất)
};
