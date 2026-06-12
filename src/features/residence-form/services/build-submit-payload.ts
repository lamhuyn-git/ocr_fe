import type { ApplicantForm, ApplicantType, CitizenDetail, Member } from "../types";

// Cấu trúc payload nộp hồ sơ (khớp contract BE).
export type ResidenceSubmitPayload = {
  form_json: null;
  recieve_method: { notification_method: string };
  thu_tuc_yeu_cau: { case: string; type: string; form_type_id: string };
  co_quan_thuc_hien: { org_id: string; province_id: string };
  thong_tin_de_nghi: { address: string; content: string; due_time: string };
  thong_tin_nguoi_de_nghi: {
    type: string; // themself | proxy
    infor: {
      name: string;
      email: string;
      gender: string;
      birth_day: string;
      id_number: string;
      phone_number: string;
    };
  };
  thanh_vien_cung_thay_doi: Array<{
    name: string;
    birth_day: string;
    gender: string;
    id_number: string;
    relationship: string;
  }>;
};

export type SubmitInput = {
  notifyMethod: string;
  caseValue: string;
  householdType: string;
  formTypeId: string;
  orgId: string;
  provinceId: string;
  wardId: string;
  address: string;
  content: string;
  dueTime: string;
  applicantType: ApplicantType;
  userDetail?: CitizenDetail;
  applicant: ApplicantForm;
  members: Member[];
};

// Khoá trường bắt buộc — dùng cho: hiển thị lỗi inline, anchor scroll, message.
// Thứ tự khai báo = thứ tự xuất hiện trên form (để scroll tới lỗi đầu tiên).
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

// Gom toàn bộ state form thành payload theo đúng cấu trúc BE.
export function buildSubmitPayload(input: SubmitInput): ResidenceSubmitPayload {
  const isSelf = input.applicantType === "self";

  // self -> lấy từ dữ liệu dân cư; proxy -> người dùng tự khai.
  const infor = isSelf
    ? {
        name: input.userDetail?.fullName ?? "",
        email: input.userDetail?.email ?? "",
        gender: input.userDetail?.gender ?? "",
        birth_day: input.userDetail?.birthday ?? "",
        id_number: input.userDetail?.nationalId ?? "",
        phone_number: input.userDetail?.phone ?? "",
      }
    : {
        name: input.applicant.fullName,
        email: input.applicant.email,
        gender: input.applicant.gender,
        birth_day: input.applicant.birthday,
        id_number: input.applicant.nationalId,
        phone_number: input.applicant.phone,
      };

  return {
    form_json: null,
    recieve_method: { notification_method: input.notifyMethod },
    thu_tuc_yeu_cau: {
      case: input.caseValue,
      type: input.householdType,
      form_type_id: input.formTypeId,
    },
    co_quan_thuc_hien: { org_id: input.orgId, province_id: input.provinceId },
    thong_tin_de_nghi: {
      address: input.address,
      content: input.content,
      due_time: input.dueTime,
    },
    thong_tin_nguoi_de_nghi: { type: isSelf ? "themself" : "proxy", infor },
    thanh_vien_cung_thay_doi: input.members.map((m) => ({
      name: m.fullName,
      birth_day: m.birthday,
      gender: m.gender,
      id_number: m.idNumber,
      relationship: m.relationship,
    })),
  };
}
