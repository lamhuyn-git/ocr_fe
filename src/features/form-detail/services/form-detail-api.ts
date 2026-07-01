import { apiFetch } from "../../../lib/http-client";
import type {
  FormDetailResponse,
  FormStatusResponse,
  SaveChangeRequest,
} from "../types";

export function isFullDetail(
  res: FormDetailResponse | FormStatusResponse,
): res is FormDetailResponse {
  return "validated_results" in res;
}

export async function fetchFormDetail(
  formId: string,
  refreshKey?: number,
): Promise<FormDetailResponse | FormStatusResponse> {
  const params = new URLSearchParams({ form_id: formId });
  if (refreshKey != null) params.set("_t", String(refreshKey));

  return apiFetch<FormDetailResponse | FormStatusResponse>(
    `/api/v1/form/detail?${params.toString()}`,
    { auth: true, cache: refreshKey != null ? "no-store" : undefined },
  );
}

export async function saveFormChanges(req: SaveChangeRequest): Promise<void> {
  await apiFetch("/api/v1/form/save_change", {
    method: "POST",
    auth: true,
    body: JSON.stringify(req),
  });
}

export async function reextractForm(
  formId: string,
): Promise<{ form_id_db: string; status: string }> {
  return apiFetch(
    `/api/v1/form/reextract?form_id=${encodeURIComponent(formId)}`,
    { method: "POST", auth: true },
  );
}

export type ReturnResultRequest = {
  form_id: string;
  outcome: "valid" | "require_adjust";
  note?: string | null;
  dia_chi?: string | null;
  tu_ngay?: string | null;
  den_ngay?: string | null;
};

export async function returnFormResult(
  req: ReturnResultRequest,
): Promise<{ form_id_db: string; status: string }> {
  return apiFetch("/api/v1/form/return", {
    method: "POST",
    auth: true,
    body: JSON.stringify(req),
  });
}
