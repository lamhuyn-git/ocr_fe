import type {
  ApplicantForm,
  ApplicantType,
  CitizenDetail,
  Member,
} from "../types";
import { GENDERS } from "../data/mock-form-data";

// Map giới tính từ value option ("nam") -> label gửi BE ("Nam"/"Nữ"/"Khác").
const genderLabel = (value?: string): string | null =>
  GENDERS.find((g) => g.value === value)?.label ?? null;

export type EvidencePayload = {
  path_url: string;
};

export type FormSpecPayload = {
  case: string | null;
  type: string | null;
  submit_type: string | null;
  location_register: string | null;
  registered_user_cccd: string | null;
  registered_user_name: string | null;
  registered_user_birth: string | null;
  registered_user_gender: string | null;
  registered_user_phone: string | null;
  registered_user_mail: string | null;
  register_content: string | null;
};

export type ResidenceSubmitPayload = {
  org_id: string;
  form_type_id: string;
  submit_by: string;
  notification_on: string;
  evidences: EvidencePayload[];
  form_spec: FormSpecPayload;
};

export type SubmitInput = {
  submitBy: string;
  notifyMethod: string;
  caseValue: string;
  householdType: string;
  formTypeId: string;
  orgId: string;
  provinceId: string;
  wardId: string;
  address: string;
  content: string; // Nội dung đề nghị
  dueTime: string;
  applicantType: ApplicantType;
  userDetail?: CitizenDetail;
  applicant: ApplicantForm;
  members: Member[];
  evidences?: EvidencePayload[];
  attachmentCount: number; // số ảnh giấy tờ đã chọn (để validate bắt buộc)
};

export type RequiredFieldKey =
  | "province"
  | "ward"
  | "procedure"
  | "applicantName"
  | "applicantBirthday"
  | "applicantGender"
  | "applicantNationalId"
  | "address"
  | "content"
  | "dueTime"
  | "attachments";

export const REQUIRED_FIELD_LABELS: Record<RequiredFieldKey, string> = {
  province: "Tỉnh/Thành phố",
  ward: "Xã/Phường/Đặc khu",
  procedure: "Thủ tục hành chính",
  applicantName: "Họ và tên người đề nghị",
  applicantBirthday: "Ngày tháng năm sinh",
  applicantGender: "Giới tính",
  applicantNationalId: "Số định danh cá nhân",
  address: "Địa chỉ",
  content: "Nội dung đề nghị",
  dueTime: "Thời hạn tạm trú đề nghị",
  attachments: "Ảnh giấy tờ đính kèm",
};

// id DOM của ô bọc field (để scrollIntoView tới field lỗi đầu tiên).
export const fieldAnchorId = (key: RequiredFieldKey) => `field-${key}`;

// Message lỗi hiển thị dưới mỗi field bắt buộc bị bỏ trống.
export const REQUIRED_FIELD_ERROR = "Vui lòng nhập thông tin bắt buộc.";

// Kiểm tra các trường bắt buộc trước khi nộp.
// Trả về danh sách KHOÁ trường còn thiếu, theo thứ tự xuất hiện trên form.
export function validateSubmit(input: SubmitInput): RequiredFieldKey[] {
  const missing: RequiredFieldKey[] = [];
  const need = (val: string | undefined, key: RequiredFieldKey) => {
    if (!val?.trim()) missing.push(key);
  };

  need(input.provinceId, "province");
  need(input.wardId, "ward");
  need(input.formTypeId, "procedure");

  // Thông tin người đề nghị luôn lấy từ section "Thông tin người đề nghị"
  // (self đã được đồng bộ dữ liệu dân cư vào `applicant`).
  const person = input.applicant;
  need(person?.fullName, "applicantName");
  need(person?.birthday, "applicantBirthday");
  need(person?.gender, "applicantGender");
  need(person?.nationalId, "applicantNationalId");

  need(input.address, "address");
  need(input.content, "content");
  need(input.dueTime, "dueTime");

  // Ảnh giấy tờ đính kèm là bắt buộc (ít nhất 1 ảnh).
  if (input.attachmentCount <= 0) missing.push("attachments");

  return missing;
}

// Gom toàn bộ state form thành payload theo đúng cấu trúc BE (FormCreate).
export function buildSubmitPayload(input: SubmitInput): ResidenceSubmitPayload {
  // Người được đăng ký cư trú luôn lấy từ section "Thông tin người đề nghị".
  const person = input.applicant;

  return {
    org_id: input.orgId,
    form_type_id: input.formTypeId,
    submit_by: input.submitBy,
    notification_on: input.notifyMethod,
    evidences: (input.evidences ?? []).map((e) => ({ path_url: e.path_url })),
    form_spec: {
      case: input.caseValue || null,
      type: input.householdType || null,
      submit_type: input.applicantType || null,
      location_register: input.address || null,
      // registered_user_cccd lấy từ Số định danh cá nhân (CCCD) của người đề nghị.
      registered_user_cccd: person?.nationalId || null,
      registered_user_name: person?.fullName || null,
      registered_user_birth: person?.birthday || null,
      registered_user_gender: genderLabel(person?.gender),
      registered_user_phone: person?.phone || null,
      registered_user_mail: person?.email || null,
      register_content: input.content || null,
    },
  };
}
