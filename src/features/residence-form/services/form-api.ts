import type { SelectOption, CitizenDetail } from "../types";
import {
  GENDERS,
  NOTIFY_METHODS,
  RESULT_METHODS,
} from "../data/mock-form-data";
import { apiFetch } from "../../../lib/http-client";
import type { ResidenceSubmitPayload } from "./build-submit-payload";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

export async function fetchProvinces(): Promise<SelectOption[]> {
  const data = await apiFetch<any[]>("/api/v1/provinces", {
    auth: true,
  });
  return data.map((p) => ({ value: p.id, label: p.name }));
}

export async function fetchWards(provinceId: string): Promise<SelectOption[]> {
  const data = await apiFetch<any[]>(
    `/api/v1/organizations?province_id=${encodeURIComponent(provinceId)}`,
    { auth: true },
  );
  return data.map((w) => ({ value: w.id, label: w.name }));
}

export async function fetchAgency(wardName: string): Promise<string> {
  return `Công an ${wardName}`;
}

export async function submitResidenceForm(
  payload: ResidenceSubmitPayload,
): Promise<unknown> {
  return apiFetch("/api/v1/form", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function saveDraftForm(
  payload: ResidenceSubmitPayload,
): Promise<unknown> {
  return apiFetch("/api/v1/form/draft", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function fetchProcedures(): Promise<SelectOption[]> {
  const data = await apiFetch<any[]>("/api/v1/form-types", {
    auth: true,
  });
  return data.map((t) => ({ value: t.id, label: t.type_name }));
}

export async function fetchCitizenDetail(
  userId: string,
): Promise<CitizenDetail> {
  const data = await apiFetch<any>(
    `/api/v1/citizens?user_id=${encodeURIComponent(userId)}`,
    { auth: true },
  );
  return {
    id: data.id,
    userId: data.user_id,
    nationalId: data.so_dinh_danh,
    fullName: data.ho_chu_dem_va_ten,
    birthday: data.ngay_sinh,
    gender: data.gioi_tinh,
    phone: data.so_dien_thoai,
    email: data.email,
    isActive: data.is_active,
  };
}

export async function fetchGenders(): Promise<SelectOption[]> {
  await delay();
  return GENDERS;
}

export async function fetchNotifyMethods(): Promise<SelectOption[]> {
  await delay();
  return NOTIFY_METHODS;
}

export async function fetchResultMethods(): Promise<SelectOption[]> {
  await delay();
  return RESULT_METHODS;
}
