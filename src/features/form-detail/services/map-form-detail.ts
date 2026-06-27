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
  SubmittedContentResponse,
  ValidatedResultResponse,
} from "../types";

// Định dạng ngày về dd/MM/yyyy
const formatDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

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

const FIELD_STATUS: Record<string, ExtractionStatus> = {
  valid: "valid",
  invalid: "invalid",
  need_review: "review",
};

const FIELD_CONFIG: Record<string, { section: string; label: string }> = {
  kinh_gui: { section: "agency", label: "Cơ quan thực hiện" },
  ho_chu_dem_va_ten: { section: "applicant", label: "Họ và tên" },
  ngay_thang_nam_sinh: { section: "applicant", label: "Ngày tháng năm sinh" },
  gioi_tinh: { section: "applicant", label: "Giới tính" },
  so_dinh_dan_ca_nhan: { section: "applicant", label: "Số định danh cá nhân" },
  so_dien_thoai_lien_he: { section: "applicant", label: "Số điện thoại" },
  email: { section: "applicant", label: "Email" },
  ho_chu_dem_va_ten_chu_ho: {
    section: "request",
    label: "Họ tên chủ hộ tạm trú",
  },
  moi_quan_he_voi_chu_ho: { section: "request", label: "Quan hệ với chủ hộ" },
  so_dinh_dan_ca_nhan_cua_chu_ho: {
    section: "request",
    label: "Số ĐDCN chủ hộ tạm trú",
  },
  noi_dung_de_nghi: { section: "request", label: "Nội dung đề nghị" },
  thanh_vien_cung_thay_doi: {
    section: "members",
    label: "Thành viên cùng thay đổi",
  },
};

// Thứ tự field theo tờ khai CT01
const FIELD_ORDER = Object.keys(FIELD_CONFIG);
const fieldOrderIndex = (label: string): number => {
  // CCCD người khai là định danh quan trọng nhất (dùng xác thực đúng người) nên luôn đẩy lên đầu danh sách field, trước cả thứ tự tờ khai CT01.
  if (label === "so_dinh_dan_ca_nhan") return -1;
  const i = FIELD_ORDER.indexOf(label);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

const SECTION_TITLES: Record<string, string> = {
  agency: "Cơ quan thực hiện",
  applicant: "Thông tin hộ thay đổi",
  request: "Thông tin đề nghị",
  members: "Những thành viên cùng thay đổi",
};
const SECTION_ORDER = ["agency", "applicant", "request", "members"];

const toField = (r: ValidatedResultResponse): ExtractionField => {
  const cfg = FIELD_CONFIG[r.label];
  const value = r.final_value || r.raw_value || r.suggested_value || "";
  const suggest = r.suggested_value ?? "";
  return {
    id: r.id,
    label: cfg?.label ?? r.label,
    value,
    // Chỉ hiện "Gần nhất" khi gợi ý khác giá trị trích xuất.
    suggestValue: suggest && suggest !== value ? suggest : undefined,
    // Giá trị CSDL thật để tham chiếu (hiện khi có và khác giá trị trích xuất).
    csdlValue: r.db_value && r.db_value !== value ? r.db_value : undefined,
    status: FIELD_STATUS[r.status] ?? "review",
    checkResult: r.note ?? "",
    // Số mốc lịch sử: 1 = chỉ bản gốc (system); >1 = đã có cán bộ chốt.
    historyCount: r.result_history?.length ?? 1,
    position: r.position,
    confirmedBy: r.confirmed_by,
    confirmedByEmail: r.confirmed_by_email,
  };
};

// Field "thành viên cùng thay đổi" rỗng (chỉ là note cho cán bộ tự soát)
const EMPTY_MEMBER_MARKERS = new Set(["", "[]", "{}", "0", "null", "none"]);
const isEmptyMembersNote = (r: ValidatedResultResponse): boolean => {
  if (r.label !== "thanh_vien_cung_thay_doi") return false;
  const v = (r.final_value ?? r.raw_value ?? "").trim().toLowerCase();
  return EMPTY_MEMBER_MARKERS.has(v);
};

const buildExtractionSections = (
  results: ValidatedResultResponse[],
): ExtractionSection[] => {
  const ordered = [...results].sort(
    (a, b) => fieldOrderIndex(a.label) - fieldOrderIndex(b.label),
  );
  const bySection = new Map<string, ExtractionField[]>();
  for (const r of ordered) {
    const sectionId = FIELD_CONFIG[r.label]?.section ?? "applicant";
    const list = bySection.get(sectionId) ?? [];
    list.push(toField(r));
    bySection.set(sectionId, list);
  }
  return SECTION_ORDER.map((id) => ({
    id,
    title: SECTION_TITLES[id],
    fields: bySection.get(id) ?? [],
  }));
};

const buildOnlineSections = (
  c: SubmittedContentResponse,
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

const buildDeclaration = (
  c: SubmittedContentResponse,
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

export function mapFormDetail(res: FormDetailResponse): FormDetail {
  const c = res.sumited_content;
  const agencyName = `Công an ${res.ogr_detailliated?.name ?? ""}`.trim();

  const procedure: ProcedureInfo = {
    hinhThuc: TYPE_LABELS[c.type] ?? c.type,
    truongHop: CASE_LABELS[c.case] ?? c.case,
    nguoiKhai: SUBMIT_TYPE_LABELS[c.submit_type] ?? c.submit_type,
  };

  const results = (res.validated_results ?? []).filter(
    (r) => !isEmptyMembersNote(r),
  );
  return {
    // Mã hồ sơ hiển thị = 6 ký tự đầu của id form.
    code: res.id.slice(0, 6).toUpperCase(),
    submittedDate: formatDate(res.created_at),
    statusLabel: res.status,
    checkedFields: 0,
    totalFields: results.length,
    procedure,
    onlineSections: buildOnlineSections(c, agencyName),
    extractionSections: buildExtractionSections(results),
    declaration: buildDeclaration(c, agencyName),
    reviewNote: res.review_note ?? null,
    isGateRejected: res.is_gate_rejected ?? false,
    outcome: res.outcome ?? null,
    returnedAt: res.returned_at ?? null,
    returnedByName: res.returned_by_name ?? null,
    returnedByEmail: res.returned_by_email ?? null,
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
