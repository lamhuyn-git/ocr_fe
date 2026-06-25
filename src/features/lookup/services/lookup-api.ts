import { apiFetch } from "../../../lib/http-client";
import type { FormStatusKey } from "../../../components/ui/Status";
import type { LookupForm } from "../types";

// Item trả về từ BE GET /api/v1/form/user-list.
type UserFormListItem = {
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

type UserFormListResponse = {
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

// ISO -> dd/MM/yyyy.
function formatDate(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

// ISO -> dd/MM/yyyy HH:mm (ngày nộp hiển thị kèm giờ).
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(iso)} ${hh}:${mi}`;
}

function toLookupForm(item: UserFormListItem): LookupForm {
  return {
    id: item.id,
    code: item.code,
    formType: item.form_type_name ?? "Đăng ký tạm trú",
    location: item.location ?? "",
    date: formatDateTime(item.created_at),
    status: item.status,
    completedDate: formatDate(item.completed_at),
    rejectReason: item.reject_reason ?? undefined,
    notifyMethod: item.notify_method ?? undefined,
  };
}

// Lấy 1 trang hồ sơ của công dân (server-side: phân trang + lọc tab + tìm kiếm).
export async function fetchUserForms(
  userId: string,
  { page = 1, pageSize = 10, group = "all", q = "" }: LookupQuery = {},
): Promise<LookupPage> {
  const params = new URLSearchParams({
    user_id: userId,
    page: String(page),
    page_size: String(pageSize),
    group,
  });
  if (q.trim()) params.set("q", q.trim());

  const res = await apiFetch<UserFormListResponse>(
    `/api/v1/form/user-list?${params.toString()}`,
    { auth: true },
  );
  return {
    items: res.items.map(toLookupForm),
    total: res.total,
    counts: res.counts,
  };
}
