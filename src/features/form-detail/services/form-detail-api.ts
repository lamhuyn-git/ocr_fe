import { apiFetch } from "../../../lib/http-client";

// Kiểu dữ liệu thô đúng theo response BE: GET /api/v1/form/detail?form_id=...
// (giữ nguyên tên field của BE, kể cả các key viết sai chính tả).

export type OrgDetail = {
  id: string;
  name: string;
  slug: string;
  org_type: string;
};

export type FormTypeDetail = {
  id: string;
  type_name: string;
  created_at: string;
};

export type SubmittedContent = {
  id: string;
  case: string;
  type: string;
  submit_type: string;
  location_register: string | null;
  registered_user_cccd: string | null;
  registered_user_name: string | null;
  registered_user_birth: string | null;
  registered_user_gender: string | null;
  registered_user_phone: string | null;
  registered_user_mail: string | null;
  register_content: string | null;
};

// BE trả evidences dạng object có key cố định (presigned URL theo loại ảnh).
export type FormEvidences = {
  warped_img?: string | null; // ảnh tờ khai CT01 đã nắn (OCR)
  residence_proof?: string | null; // ảnh giấy tờ chứng minh chỗ ở
};

export type ValidatedResult = {
  id: string;
  position: number[] | null; // bbox [x, y, width, height] trên ảnh đã nắn
  label: string; // mã field BE (vd "gioi_tinh", "kinh_gui")
  raw_value: string | null; // giá trị OCR trích xuất
  suggested_value: string | null; // giá trị BE đề xuất (đối chiếu CSDL)
  final_value: string | null; // giá trị cán bộ chốt (null nếu chưa soát)
  note: string | null; // kết quả kiểm tra
  status: string; // "valid" | "invalid" | "need_review"
  confirmed_by: string | null; // cán bộ đã xác nhận field này
  confirmed_by_email: string | null; // email cán bộ đã chốt
  created_at: string;
};

export type FormDetailResponse = {
  id: string;
  form_type_id: string;
  org_id: string;
  submit_by: string;
  status: string;
  notification_on: string;
  review_note: string | null;
  created_at: string;
  updated_at: string;
  ogr_detailliated: OrgDetail;
  form_type_detail: FormTypeDetail;
  sumited_content: SubmittedContent;
  evidences: FormEvidences;
  validated_results: ValidatedResult[];
};

export async function fetchFormDetail(
  formId: string,
): Promise<FormDetailResponse> {
  return apiFetch<FormDetailResponse>(
    `/api/v1/form/detail?form_id=${encodeURIComponent(formId)}`,
    { auth: true },
  );
}

export type AdminSaveChangeFieldItem = {
  id: string;
  status: "valid" | "invalid";
};

export type SaveChangeRequest = {
  form_id: string;
  confirmed_by: string | null;
  updated_fields: AdminSaveChangeFieldItem[] | null;
  from_status: string | null; // trạng thái hồ sơ trước khi cán bộ vào xem
};

export async function saveFormChanges(req: SaveChangeRequest): Promise<void> {
  await apiFetch("/api/v1/form/admin/save_change", {
    method: "POST",
    auth: true,
    body: JSON.stringify(req),
  });
}

// Kích hoạt lại trích xuất OCR cho 1 form (chạy bất đồng bộ phía BE).
export async function reextractForm(
  formId: string,
): Promise<{ form_id_db: string; status: string }> {
  return apiFetch(
    `/api/v1/form/reextract?form_id=${encodeURIComponent(formId)}`,
    { method: "POST", auth: true },
  );
}
