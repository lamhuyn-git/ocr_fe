import type { FormStatusKey } from "../../components/ui/Status";
import type {
  EvidencesResponse,
  FormTypeResponse,
  OrgResponse,
  SubmittedContentResponse,
} from "../form-detail/types";

export type UserFormListItem = {
  id: string;
  code: string;
  status: FormStatusKey;
  form_type_name: string | null;
  location: string | null;
  created_at: string; // ISO datetime
  completed_at?: string | null;
  reject_reason?: string | null;
  notify_method?: string | null;
};

export type LookupCounts = {
  all: number;
  submitted: number;
  draft: number;
  processing: number;
  valid: number;
  invalid: number;
};

export type UserFormListResponse = {
  items: UserFormListItem[];
  total: number;
  counts: LookupCounts;
};

export type LookupPage = {
  items: LookupForm[];
  total: number;
  counts: LookupCounts;
};

export type LookupQuery = {
  page?: number;
  pageSize?: number;
  group?: "all" | "submitted" | "draft";
  q?: string;
};

export type LookupForm = {
  id: string;
  code: string; // mã hồ sơ hiển thị
  formType: string; // loại thủ tục, vd "Đăng ký tạm trú"
  location: string; // địa chỉ đăng ký
  date: string; // ngày nộp / cập nhật (dd/MM/yyyy)
  status: FormStatusKey; // draft | submitted | extracted | approved | ...
  completedDate?: string; // ngày hoàn thành (dd/MM/yyyy) — khi đã trả kết quả
  rejectReason?: string; // lý do từ chối/trả lại — hiện khi rejected/returned
  notifyMethod?: string; // kênh nhận thông báo (portal | email | sms)
};

export type UserFormDetail = {
  id: string;
  form_type_id: string | null;
  org_id: string | null;
  status: FormStatusKey;
  notification_on: string | null;
  created_at: string;
  updated_at: string;
  ogr_detailliated: OrgResponse | null;
  form_type_detail: FormTypeResponse | null;
  sumited_content: SubmittedContentResponse | null;
  evidences: EvidencesResponse;
};
