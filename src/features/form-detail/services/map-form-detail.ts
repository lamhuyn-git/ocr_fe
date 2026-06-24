import type {
  EvidenceImage,
  ExtractionField,
  ExtractionSection,
  ExtractionStatus,
  FormDeclaration,
  FormDetail,
  OnlineInfoSection,
  ProcedureInfo,
} from "../types";
import type {
  FormDetailResponse,
  SubmittedContent,
  ValidatedResult,
} from "./form-detail-api";

// ISO -> dd/MM/yyyy (giữ nguyên nếu đã đúng định dạng / parse lỗi).
const formatDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

// case / type / submit_type -> nhãn thủ tục (panel trái + phải).
const CASE_LABELS: Record<string, string> = {
  residence_registration: "Đăng ký tạm trú (nhân khẩu, hộ)",
};
const TYPE_LABELS: Record<string, string> = {
  add_new: "Đăng ký lập hộ mới",
};
const SUBMIT_TYPE_LABELS: Record<string, string> = {
  self: "Là người Đăng ký tạm trú",
  proxy: "Khai hộ",
};

// status field trích xuất (BE) -> enum FE.
const FIELD_STATUS: Record<string, ExtractionStatus> = {
  valid: "valid",
  invalid: "invalid",
  need_review: "review",
};

// Mã field BE -> section + nhãn hiển thị (panel phải gom theo section).
const FIELD_CONFIG: Record<string, { section: string; label: string }> = {
  kinh_gui: { section: "agency", label: "Cơ quan thực hiện" },
  so_dinh_dan_ca_nhan: { section: "applicant", label: "Số định danh cá nhân" },
  ho_chu_dem_va_ten: { section: "applicant", label: "Họ và tên" },
  gioi_tinh: { section: "applicant", label: "Giới tính" },
  ngay_thang_nam_sinh: { section: "applicant", label: "Ngày tháng năm sinh" },
  so_dien_thoai_lien_he: { section: "applicant", label: "Số điện thoại" },
  email: { section: "applicant", label: "Email" },
  noi_dung_de_nghi: { section: "request", label: "Nội dung đề nghị" },
  ho_chu_dem_va_ten_chu_ho: {
    section: "request",
    label: "Họ tên chủ hộ tạm trú",
  },
  moi_quan_he_voi_chu_ho: { section: "request", label: "Quan hệ với chủ hộ" },
  so_dinh_dan_ca_nhan_cua_chu_ho: {
    section: "request",
    label: "Số ĐDCN chủ hộ tạm trú",
  },
  thanh_vien_cung_thay_doi: {
    section: "members",
    label: "Thành viên cùng thay đổi",
  },
};

const SECTION_TITLES: Record<string, string> = {
  agency: "Cơ quan thực hiện",
  applicant: "Thông tin hộ thay đổi",
  request: "Thông tin đề nghị",
  members: "Những thành viên cùng thay đổi",
};
const SECTION_ORDER = ["agency", "applicant", "request", "members"];

// 1 validated_result -> 1 field hiển thị ở panel phải.
const toField = (r: ValidatedResult): ExtractionField => {
  const cfg = FIELD_CONFIG[r.label];
  // OCR đọc rỗng ("") -> fallback sang giá trị gợi ý để vẫn hiển thị.
  const value = r.final_value || r.raw_value || r.suggested_value || "";
  const suggest = r.suggested_value ?? "";
  return {
    id: r.id,
    label: cfg?.label ?? r.label,
    value,
    // Chỉ hiện "Gần nhất" khi gợi ý khác giá trị trích xuất.
    suggestValue: suggest && suggest !== value ? suggest : undefined,
    status: FIELD_STATUS[r.status] ?? "review",
    checkResult: r.note ?? "",
    historyCount: 1,
    position: r.position,
    confirmedBy: r.confirmed_by,
    confirmedByEmail: r.confirmed_by_email,
  };
};

// Ưu tiên sắp xếp field theo trạng thái: invalid > cần xem > hợp lệ.
const STATUS_PRIORITY: Record<ExtractionStatus, number> = {
  invalid: 0,
  review: 1,
  valid: 2,
};

const buildExtractionSections = (
  results: ValidatedResult[],
): ExtractionSection[] => {
  const bySection = new Map<string, ExtractionField[]>();
  for (const r of results) {
    const sectionId = FIELD_CONFIG[r.label]?.section ?? "applicant";
    const list = bySection.get(sectionId) ?? [];
    list.push(toField(r));
    bySection.set(sectionId, list);
  }
  return SECTION_ORDER.map((id) => ({
    id,
    title: SECTION_TITLES[id],
    fields: (bySection.get(id) ?? []).sort(
      (a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status],
    ),
  }));
};

// Panel trái ("Thông tin điền online") dựng từ nội dung người dân đã nộp.
const buildOnlineSections = (
  c: SubmittedContent,
  agencyName: string,
): OnlineInfoSection[] => [
  {
    id: "agency",
    title: "Cơ quan thực hiện",
    rows: [{ label: "Cơ quan thực hiện", value: agencyName }],
  },
  {
    id: "applicant",
    title: "Thông tin hộ thay đổi",
    rows: [
      { label: "Họ và tên", value: c.registered_user_name ?? "" },
      {
        label: "Ngày tháng năm sinh",
        value: formatDate(c.registered_user_birth),
      },
      { label: "Giới tính", value: c.registered_user_gender ?? "" },
      { label: "Số định danh cá nhân", value: c.registered_user_cccd ?? "" },
      { label: "Số điện thoại", value: c.registered_user_phone ?? "" },
      { label: "Email", value: c.registered_user_mail ?? "" },
    ],
  },
  {
    id: "request",
    title: "Thông tin đề nghị",
    rows: [{ label: "Nội dung đề nghị", value: c.register_content ?? "" }],
  },
  {
    id: "members",
    title: "Những thành viên cùng thay đổi",
    rows: [{ label: "Số thành viên", value: "0" }],
  },
];

// Tờ khai CT01 ở giữa: chủ hộ tạm trú = người đề nghị (luồng tự nộp).
const buildDeclaration = (
  c: SubmittedContent,
  agencyName: string,
): FormDeclaration => ({
  recipient: agencyName,
  fullName: c.registered_user_name ?? "",
  birthday: formatDate(c.registered_user_birth),
  gender: c.registered_user_gender ?? "",
  nationalId: c.registered_user_cccd ?? "",
  phone: c.registered_user_phone ?? "",
  email: c.registered_user_mail ?? "",
  ownerName: c.registered_user_name ?? "",
  ownerRelationship: "Chủ hộ",
  ownerNationalId: c.registered_user_cccd ?? "",
  requestContent: c.register_content ?? "",
  members: [],
});

// Map toàn bộ response BE -> FormDetail dùng cho UI hiện tại.
export function mapFormDetail(res: FormDetailResponse): FormDetail {
  const c = res.sumited_content;
  const agencyName = `Công an ${res.ogr_detailliated?.name ?? ""}`.trim();

  const procedure: ProcedureInfo = {
    hinhThuc: TYPE_LABELS[c.type] ?? c.type,
    truongHop: CASE_LABELS[c.case] ?? c.case,
    nguoiKhai: SUBMIT_TYPE_LABELS[c.submit_type] ?? c.submit_type,
  };

  // Bỏ field "thành viên cùng thay đổi" khi không có thành viên nào
  // (chỉ là note cho cán bộ) -> panel phải hiển thị thông báo trống.
  const results = (res.validated_results ?? []).filter(
    (r) =>
      !(
        r.label === "thanh_vien_cung_thay_doi" &&
        !r.raw_value &&
        !r.final_value
      ),
  );
  return {
    // Mã hồ sơ hiển thị = 6 ký tự đầu của id form.
    code: res.id.slice(0, 6).toUpperCase(),
    submittedDate: formatDate(res.created_at),
    // Truyền raw status key; component Status tự map nhãn + màu.
    statusLabel: res.status,
    // Số field cán bộ đã kiểm tra / tổng field trích xuất.
    checkedFields: 0,
    totalFields: results.length,
    procedure,
    onlineSections: buildOnlineSections(c, agencyName),
    extractionSections: buildExtractionSections(results),
    declaration: buildDeclaration(c, agencyName),
    reviewNote: res.review_note ?? null,
    // warped_img -> tab tờ khai CT01; residence_proof -> tab đính kèm.
    evidences: [
      res.evidences?.warped_img && {
        id: "warped_img",
        url: res.evidences.warped_img,
        isCt01: true,
      },
      res.evidences?.residence_proof && {
        id: "residence_proof",
        url: res.evidences.residence_proof,
        isCt01: false,
      },
    ].filter((e): e is EvidenceImage => Boolean(e)),
  };
}
