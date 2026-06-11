import type { SelectOption } from "../types";
import {
  GENDERS,
  NOTIFY_METHODS,
  RESULT_METHODS,
} from "../data/mock-form-data";
import { apiFetch } from "../../../lib/http-client";

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

export async function fetchProcedures(): Promise<SelectOption[]> {
  const data = await apiFetch<any[]>("/api/v1/form/type", {
    auth: true,
  });
  return data.map((w) => ({ value: w.id, label: w.name }));
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
