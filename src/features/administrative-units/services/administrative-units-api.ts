import { apiFetch } from "../../../lib/http-client";

type RawRecord = Record<string, unknown>;

export type AdministrativeStatus = "active" | "inactive";

export type ProvinceItem = {
  id: string;
  code: string;
  name: string;
  status: AdministrativeStatus;
};

export type WardItem = {
  id: string;
  code: string;
  name: string;
  provinceId: string;
  status: AdministrativeStatus;
};

export type WardAddressItem = {
  id: string;
  wardId: string;
  wardCode: string;
  address: string;
  description: string;
  status: AdministrativeStatus;
};

export type ProvincePayload = {
  slug: string;
  name: string;
  is_active: boolean;
};

export type WardPayload = {
  slug: string;
  name: string;
  province_id: string;
  is_active: boolean;
};

export type WardAddressPayload = {
  org_id: string;
  dia_chi: string;
  is_active: boolean;
};

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() !== "false";
  return true;
}

function asList(value: unknown): RawRecord[] {
  if (Array.isArray(value)) return value as RawRecord[];
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as RawRecord).items)
  ) {
    return (value as RawRecord).items as RawRecord[];
  }
  return [];
}

function readCode(record: RawRecord): string {
  return (
    asString(record.code) ||
    asString(record.province_code) ||
    asString(record.org_code) ||
    asString(record.ward_code) ||
    asString(record.slug) ||
    asString(record.id)
  );
}

function readStatus(record: RawRecord): AdministrativeStatus {
  return asBoolean(record.is_active ?? record.active) ? "active" : "inactive";
}

export async function listProvinces(): Promise<ProvinceItem[]> {
  const data = await apiFetch<unknown>("/api/v1/provinces", { auth: true });
  return asList(data).map((record) => ({
    id: asString(record.id),
    code: readCode(record),
    name: asString(record.name) || asString(record.province_name),
    status: readStatus(record),
  }));
}

export async function createProvince(payload: ProvincePayload): Promise<void> {
  await apiFetch("/api/v1/provinces", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateProvince(
  provinceId: string,
  payload: ProvincePayload,
): Promise<void> {
  await apiFetch(`/api/v1/provinces/${encodeURIComponent(provinceId)}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteProvince(provinceId: string): Promise<void> {
  await apiFetch(`/api/v1/provinces/${encodeURIComponent(provinceId)}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function listWards(provinceId?: string): Promise<WardItem[]> {
  const query = provinceId
    ? `?province_id=${encodeURIComponent(provinceId)}`
    : "";
  const data = await apiFetch<unknown>(`/api/v1/organizations${query}`, {
    auth: true,
  });
  return asList(data).map((record) => ({
    id: asString(record.id) || asString(record.org_id),
    code: readCode(record),
    name: asString(record.name) || asString(record.org_name),
    provinceId: asString(record.province_id) || provinceId || "",
    status: readStatus(record),
  }));
}

export async function createWard(payload: WardPayload): Promise<void> {
  await apiFetch("/api/v1/organizations", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateWard(
  wardId: string,
  payload: WardPayload,
): Promise<void> {
  await apiFetch(`/api/v1/organizations/${encodeURIComponent(wardId)}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteWard(wardId: string): Promise<void> {
  await apiFetch(`/api/v1/organizations/${encodeURIComponent(wardId)}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function listWardAddresses(
  wardId: string,
): Promise<WardAddressItem[]> {
  const data = await apiFetch<unknown>(
    `/api/v1/org-addresses?org_id=${encodeURIComponent(wardId)}`,
    { auth: true },
  );
  return asList(data).map((record) => ({
    id: asString(record.id),
    wardId: asString(record.org_id) || wardId,
    wardCode: asString(record.ward_code) || asString(record.org_code),
    address:
      asString(record.address) ||
      asString(record.dia_chi) ||
      asString(record.full_address),
    description: asString(record.description) || asString(record.mo_ta),
    status: readStatus(record),
  }));
}

export async function createWardAddress(
  payload: WardAddressPayload,
): Promise<void> {
  await apiFetch("/api/v1/org-addresses", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateWardAddress(
  addressId: string,
  payload: Partial<WardAddressPayload>,
): Promise<void> {
  await apiFetch(`/api/v1/org-addresses/${encodeURIComponent(addressId)}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteWardAddress(addressId: string): Promise<void> {
  await apiFetch(`/api/v1/org-addresses/${encodeURIComponent(addressId)}`, {
    method: "DELETE",
    auth: true,
  });
}
