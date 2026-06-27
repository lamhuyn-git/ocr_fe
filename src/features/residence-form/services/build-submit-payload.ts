import type {
  ApplicantForm,
  ApplicantType,
  CitizenDetail,
  Member,
} from "../types";
import { GENDERS } from "../data/mock-form-data";

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
  residence_until: string | null; // thời hạn tạm trú đề nghị (đến ngày), dd/mm/yyyy
};

export type ResidenceSubmitPayload = {
  org_id: string | null;
  form_type_id: string | null;
  submit_by: string;
  notification_on: string | null;
  evidences: EvidencePayload[];
  form_spec: FormSpecPayload | null;
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
  attachmentCount: number;
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

// Setting để scroll đến lỗi đầu tiên
export const fieldAnchorId = (key: RequiredFieldKey) => `field-${key}`;

// Message lỗi hiển thị dưới mỗi field bắt buộc bị bỏ trống.
export const REQUIRED_FIELD_ERROR = "Vui lòng nhập thông tin bắt buộc.";

// Kiểm tra các trường bắt buộc trước khi nộp
export function validateSubmit(input: SubmitInput): RequiredFieldKey[] {
  const missing: RequiredFieldKey[] = [];
  const need = (val: string | undefined, key: RequiredFieldKey) => {
    if (!val?.trim()) missing.push(key);
  };

  // Thủ tục hành chính yêu cầu
  need(input.provinceId, "province");
  need(input.wardId, "ward");
  need(input.formTypeId, "procedure");

  // Thông tin người đề nghị
  const person = input.applicant;
  need(person?.fullName, "applicantName");
  need(person?.birthday, "applicantBirthday");
  need(person?.gender, "applicantGender");
  need(person?.nationalId, "applicantNationalId");

  // Thông tin đề nghị
  need(input.address, "address");
  need(input.content, "content");
  need(input.dueTime, "dueTime");

  // Ảnh giấy tờ đính kèm
  if (input.attachmentCount <= 0) missing.push("attachments");

  return missing;
}

// Gom toàn bộ state form thành payload. Dùng chung cho nộp & lưu nháp:
// org_id/form_type_id/notification_on null hoá khi trống (nháp khai dở); khi nộp đã
// được validateSubmit() đảm bảo có giá trị nên || null trả lại đúng string.
export function buildSubmitPayload(input: SubmitInput): ResidenceSubmitPayload {
  const person = input.applicant;
  return {
    org_id: input.orgId || null,
    form_type_id: input.formTypeId || null,
    submit_by: input.submitBy,
    notification_on: input.notifyMethod || null,
    evidences: (input.evidences ?? []).map((e) => ({ path_url: e.path_url })),
    form_spec: {
      case: input.caseValue || null,
      type: input.householdType || null,
      submit_type: input.applicantType || null,
      location_register: input.address || null,
      registered_user_cccd: person?.nationalId || null,
      registered_user_name: person?.fullName || null,
      registered_user_birth: person?.birthday || null,
      registered_user_gender: genderLabel(person?.gender),
      registered_user_phone: person?.phone || null,
      registered_user_mail: person?.email || null,
      register_content: input.content || null,
      residence_until: input.dueTime || null,
    },
  };
}
