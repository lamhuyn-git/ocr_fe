import type {
  ApplicantForm,
  ApplicantType,
  CitizenDetail,
  Member,
} from "../types";

export type EvidencePayload = {
  path_url: string;
};

export type FormSpecPayload = {
  form_id: string;
  case: string | null;
  type: string | null;
  location_register: string | null;
  registered_user_id: string | null;
  register_content: unknown | null;
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
  | "dueTime";

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

  // Thông tin người đề nghị (self -> dữ liệu dân cư, proxy -> tự khai).
  const person =
    input.applicantType === "self" ? input.userDetail : input.applicant;
  need(person?.fullName, "applicantName");
  need(person?.birthday, "applicantBirthday");
  need(person?.gender, "applicantGender");
  need(person?.nationalId, "applicantNationalId");

  need(input.address, "address");
  need(input.content, "content");
  need(input.dueTime, "dueTime");

  return missing;
}

// Gom toàn bộ state form thành payload theo đúng cấu trúc BE (FormCreate).
export function buildSubmitPayload(input: SubmitInput): ResidenceSubmitPayload {
  const isSelf = input.applicantType === "self";

  // form_id chung cho form_spec & evidences (1 hồ sơ = 1 form_id).
  const formId = crypto.randomUUID();

  // Người được đăng ký cư trú: self -> chính user; proxy -> chưa xác định.
  const registeredUserId = isSelf ? (input.userDetail?.userId ?? null) : null;

  // register_content = Nội dung đề nghị (người dùng nhập).
  const registerContent = input.content || null;

  // evidences đã upload -> gắn form_id của hồ sơ này.
  const evidences = (input.evidences ?? []).map((e) => ({
    form_id: formId,
    path_url: e.path_url,
  }));

  return {
    org_id: input.orgId,
    form_type_id: input.formTypeId,
    submit_by: input.submitBy,
    notification_on: input.notifyMethod,
    evidences,
    form_spec: {
      form_id: formId,
      case: input.caseValue || null,
      type: input.householdType || null,
      location_register: input.address || null,
      registered_user_id: registeredUserId,
      register_content: registerContent,
    },
  };
}
