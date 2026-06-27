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

export type LabelValue = { label: string; value: string };

export type OnlineInfoSection = {
  id: string;
  title: string;
  rows: LabelValue[];
};

export type ExtractionField = {
  id: string;
  label: string;
  value: string;
  suggestValue?: string;
  csdlValue?: string;
  status: ExtractionStatus;
  checkResult: string;
  historyCount: number;
  position?: number[] | null;
  confirmedBy?: string | null;
  confirmedByEmail?: string | null;
};

export type ExtractionSection = {
  id: string;
  title: string;
  fields: ExtractionField[];
};

export type SaveChangeFieldItem = {
  id: string;
  status: "valid" | "invalid";
};

export type HouseholdMember = {
  order: number;
  fullName: string;
  birthday: string;
  gender: string;
  nationalId: string;
  relationship: string;
};

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

export type EvidenceImage = {
  id: string;
  url: string;
  isCt01: boolean;
};

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
  reviewNote: string | null;
  isGateRejected: boolean;
  outcome: "valid" | "require_adjust" | null;
  returnedAt: string | null;
  returnedByName: string | null;
  returnedByEmail: string | null;
};

export type OrgResponse = {
  id: string;
  name: string;
  slug: string;
  org_type: string;
};

export type FormTypeResponse = {
  id: string;
  type_name: string;
  created_at: string;
};

export type SubmittedContentResponse = {
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
  residence_until: string | null;
};

export type EvidencesResponse = {
  warped_img?: string | null;
  residence_proof?: string | null;
};

export type HistoryUserResponse = {
  id: string;
  email: string | null;
  full_name: string | null;
};

export type ResultHistoryResponse = {
  source: "system" | "confirm";
  status: string;
  value: string | null;
  confirmed_by: HistoryUserResponse | null;
  created_at: string;
};

export type ValidatedResultResponse = {
  id: string;
  position: number[] | null;
  label: string;
  raw_value: string | null;
  suggested_value: string | null;
  db_value: string | null;
  final_value: string | null;
  note: string | null;
  status: string;
  confirmed_by: string | null;
  confirmed_by_email: string | null;
  created_at: string;
  result_history: ResultHistoryResponse[];
};

export type FormDetailResponse = {
  id: string;
  form_type_id: string;
  org_id: string;
  submit_by: string;
  status: string;
  notification_on: string;
  review_note: string | null;
  is_gate_rejected: boolean;
  created_at: string;
  updated_at: string;
  outcome?: "valid" | "require_adjust" | null;
  returned_at?: string | null;
  returned_by_name?: string | null;
  returned_by_email?: string | null;
  ogr_detailliated: OrgResponse;
  form_type_detail: FormTypeResponse;
  sumited_content: SubmittedContentResponse;
  evidences: EvidencesResponse;
  validated_results: ValidatedResultResponse[];
};

export type FormStatusResponse = { form_id_db: string; status: string };

export type SaveChangeRequest = {
  form_id: string;
  confirmed_by: string | null;
  updated_fields: SaveChangeFieldItem[] | null;
  from_status: string | null;
};
