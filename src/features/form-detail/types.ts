// Kiểu dữ liệu cho trang "Chi tiết hồ sơ" (kết quả trích xuất).

// Trạng thái kiểm tra của từng trường/mục trích xuất.
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

// Thông tin thủ tục hành chính (hiển thị ở cả 2 panel trái/phải).
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

// Chi tiết kiểm tra dạng đối chiếu (vd: Cơ quan thực hiện).
export type VerifyDetail = {
  currentValue: string;
  latestResult: string;
  checkResult: string;
  historyCount: number;
};

// Mục accordion ở panel phải ("Kết quả trích xuất").
export type ExtractionSection = {
  id: string;
  title: string;
  status?: ExtractionStatus;
  verify?: VerifyDetail; // card đối chiếu (có nút hành động)
  fields?: LabelValue[]; // card danh sách trường
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
};
