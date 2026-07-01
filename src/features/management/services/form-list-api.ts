import { apiFetch } from "../../../lib/http-client";
import { fetchProcedures } from "../../residence-form/services/form-api";
import type { DocumentRecord } from "../types";

type FormResponse = {
  id: string;
  form_type_id: string | null;
  org_id: string | null;
  submit_by: string | null;
  status: string;
  notification_on: string | null;
  created_at: string;
  updated_at: string;
};

export type ListFormParams = {
  typeId?: string;
  organizationId?: string;
  status?: string;
  fromDay?: string; // "YYYY-MM-DD"
  toDay?: string; // "YYYY-MM-DD"
  page?: number;
};

// ISO date-time -> "DD/MM/YYYY".
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export async function getListForm(
  params: ListFormParams = {},
): Promise<DocumentRecord[]> {
  const query = new URLSearchParams();
  if (params.typeId) query.set("type_id", params.typeId);
  if (params.organizationId)
    query.set("organization_id", params.organizationId);
  if (params.status) query.set("status", params.status);
  if (params.fromDay) query.set("date_from", params.fromDay);
  if (params.toDay) query.set("date_to", params.toDay);
  if (params.page != null) query.set("page", String(params.page));
  const qs = query.toString();

  // Tải song song danh sách form + bảng tra tên loại form (form_type_id -> tên).
  const [forms, procedures] = await Promise.all([
    apiFetch<FormResponse[]>(`/api/v1/form/list${qs ? `?${qs}` : ""}`, {
      auth: true,
    }),
    fetchProcedures().catch(() => []),
  ]);
  const typeNameById = new Map(procedures.map((p) => [p.value, p.label]));

  return forms.map((f) => ({
    id: f.id,
    status: f.status,
    submittedDate: formatDate(f.created_at),
    handler: f.submit_by ?? "—",
    formType: (f.form_type_id && typeNameById.get(f.form_type_id)) || "—",
    extractedSections: [],
  }));
}

// 5 nhóm KPI hiển thị trên dashboard.
export type KpiCounts = {
  received_today: number;
  overdue: number;
  failed: number;
  saved: number;
  completed: number;
};

// Map các stt ở backend với nhóm KPI đang hiển thị
const KPI_STATUS_GROUP: Record<string, keyof KpiCounts> = {
  submitted: "received_today",
  processing: "received_today",
  extracted: "received_today",
  overdue: "overdue",
  failed: "failed",
  gate_rejected: "failed",
  reviewed: "saved",
  returned: "completed",
};

const BACKEND_DEFAULT_PAGE_SIZE = 10;

export async function getFormStatusCounts(
  params: Pick<
    ListFormParams,
    "typeId" | "organizationId" | "fromDay" | "toDay"
  > = {},
): Promise<KpiCounts> {
  const counts: KpiCounts = {
    received_today: 0,
    overdue: 0,
    failed: 0,
    saved: 0,
    completed: 0,
  };

  let page = 1;
  while (true) {
    const query = new URLSearchParams();
    if (params.typeId) query.set("type_id", params.typeId);
    if (params.organizationId)
      query.set("organization_id", params.organizationId);
    if (params.fromDay) query.set("date_from", params.fromDay);
    if (params.toDay) query.set("date_to", params.toDay);
    query.set("page", String(page));

    const forms = await apiFetch<FormResponse[]>(
      `/api/v1/form/list?${query.toString()}`,
      { auth: true },
    );

    for (const f of forms) {
      const group = KPI_STATUS_GROUP[f.status];
      if (group) counts[group] += 1;
    }

    if (forms.length < BACKEND_DEFAULT_PAGE_SIZE) break;
    page += 1;
  }

  return counts;
}
