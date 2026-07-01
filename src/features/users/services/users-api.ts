import { apiFetch } from "../../../lib/http-client";

type RawRecord = Record<string, unknown>;

export type Gender = "Nam" | "Nữ" | "Khác";
export type ResidenceStatus = "thuong_tru" | "tam_tru" | "khac";
export type LifeStatus = "alive" | "dead";

export type CitizenItem = {
  id: string;
  ho_chu_dem_va_ten: string;
  ten_goi_khac: string;
  ngay_sinh: string;
  gioi_tinh: Gender;
  noi_sinh: string;
  noi_dang_ky_khai_sinh: string;
  que_quan: string;
  dan_toc: string;
  ton_giao: string;
  quoc_tich: string;
  nhom_mau: string;
  noi_thuong_tru: string;
  noi_tam_tru: string;
  noi_o_hien_tai: string;
  tinh_trang_cu_tru: ResidenceStatus;
  ma_ho: string;
  quan_he_voi_chu_ho: string;
  so_dinh_danh_chu_ho: string;
  tinh_trang_hon_nhan: string;
  nghe_nghiep: string;
  tinh_trang_song: LifeStatus;
  ngay_mat: string;
  so_dien_thoai: string;
  email: string;
  so_dinh_danh: string;
};

export type CitizenPayload = Omit<CitizenItem, "id">;

export type CitizenPage = {
  items: CitizenItem[];
  total: number;
};

export type UserAccountWard = {
  org_id: string;
  ward_name: string;
  province_id: string;
  province_name: string;
};

export type UserAccountItem = {
  id: string;
  national_id: string;
  email: string;
  full_name: string;
  role: string;
  ward: UserAccountWard | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
};

const EMPTY_CITIZEN: CitizenPayload = {
  ho_chu_dem_va_ten: "",
  ten_goi_khac: "",
  ngay_sinh: "",
  gioi_tinh: "Nam",
  noi_sinh: "",
  noi_dang_ky_khai_sinh: "",
  que_quan: "",
  dan_toc: "",
  ton_giao: "",
  quoc_tich: "",
  nhom_mau: "",
  noi_thuong_tru: "",
  noi_tam_tru: "",
  noi_o_hien_tai: "",
  tinh_trang_cu_tru: "thuong_tru",
  ma_ho: "",
  quan_he_voi_chu_ho: "",
  so_dinh_danh_chu_ho: "",
  tinh_trang_hon_nhan: "Độc thân",
  nghe_nghiep: "",
  tinh_trang_song: "alive",
  ngay_mat: "",
  so_dien_thoai: "",
  email: "",
  so_dinh_danh: "",
};

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (typeof value === "number") return value === 1;
  return false;
}

function asList(value: unknown): RawRecord[] {
  if (Array.isArray(value)) return value as RawRecord[];
  if (value && typeof value === "object") {
    const record = value as RawRecord;
    if (Array.isArray(record.items)) return record.items as RawRecord[];
    if (Array.isArray(record.data)) return record.data as RawRecord[];
    if (Array.isArray(record.results)) return record.results as RawRecord[];
  }
  return [];
}

function asTotal(value: unknown, fallback: number): number {
  if (value && typeof value === "object") {
    const record = value as RawRecord;
    const total = record.total ?? record.count ?? record.total_items;
    if (typeof total === "number") return total;
    if (typeof total === "string") {
      const parsed = Number(total);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return fallback;
}

function readGender(value: unknown): Gender {
  const text = asString(value);
  if (text === "Nữ" || text.toLowerCase() === "nu") return "Nữ";
  if (text === "Khác" || text.toLowerCase() === "khac") return "Khác";
  return "Nam";
}

function readResidenceStatus(value: unknown): ResidenceStatus {
  const text = asString(value);
  if (text === "tam_tru") return "tam_tru";
  if (text === "khac") return "khac";
  return "thuong_tru";
}

function readLifeStatus(value: unknown): LifeStatus {
  return asString(value) === "dead" ? "dead" : "alive";
}

export function createEmptyCitizen(): CitizenPayload {
  return { ...EMPTY_CITIZEN };
}

export function mapCitizen(record: RawRecord): CitizenItem {
  return {
    id: asString(record.id) || asString(record.user_id) || asString(record.so_dinh_danh),
    ho_chu_dem_va_ten: asString(record.ho_chu_dem_va_ten),
    ten_goi_khac: asString(record.ten_goi_khac),
    ngay_sinh: asString(record.ngay_sinh),
    gioi_tinh: readGender(record.gioi_tinh),
    noi_sinh: asString(record.noi_sinh),
    noi_dang_ky_khai_sinh: asString(record.noi_dang_ky_khai_sinh),
    que_quan: asString(record.que_quan),
    dan_toc: asString(record.dan_toc),
    ton_giao: asString(record.ton_giao),
    quoc_tich: asString(record.quoc_tich),
    nhom_mau: asString(record.nhom_mau),
    noi_thuong_tru: asString(record.noi_thuong_tru),
    noi_tam_tru: asString(record.noi_tam_tru),
    noi_o_hien_tai: asString(record.noi_o_hien_tai),
    tinh_trang_cu_tru: readResidenceStatus(record.tinh_trang_cu_tru),
    ma_ho: asString(record.ma_ho),
    quan_he_voi_chu_ho: asString(record.quan_he_voi_chu_ho),
    so_dinh_danh_chu_ho: asString(record.so_dinh_danh_chu_ho),
    tinh_trang_hon_nhan: asString(record.tinh_trang_hon_nhan),
    nghe_nghiep: asString(record.nghe_nghiep),
    tinh_trang_song: readLifeStatus(record.tinh_trang_song),
    ngay_mat: asString(record.ngay_mat),
    so_dien_thoai: asString(record.so_dien_thoai),
    email: asString(record.email),
    so_dinh_danh: asString(record.so_dinh_danh),
  };
}

function mapUserAccount(record: RawRecord): UserAccountItem {
  const ward =
    record.ward && typeof record.ward === "object"
      ? (record.ward as RawRecord)
      : null;

  return {
    id: asString(record.id),
    national_id: asString(record.national_id),
    email: asString(record.email),
    full_name: asString(record.full_name),
    role: asString(record.role),
    ward: ward
      ? {
          org_id: asString(ward.org_id),
          ward_name: asString(ward.ward_name),
          province_id: asString(ward.province_id),
          province_name: asString(ward.province_name),
        }
      : null,
    is_active: asBoolean(record.is_active),
    is_superuser: asBoolean(record.is_superuser),
    created_at: asString(record.created_at),
  };
}

export async function listCitizens({
  page = 1,
  pageSize = 20,
}: {
  page?: number;
  pageSize?: number;
} = {}): Promise<CitizenPage> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  const data = await apiFetch<unknown>(`/api/v1/citizens/list?${params}`, {
    auth: true,
  });
  const items = asList(data).map(mapCitizen);
  return {
    items,
    total: asTotal(data, items.length),
  };
}

export async function createCitizen(payload: CitizenPayload): Promise<void> {
  await apiFetch("/api/v1/citizens", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateCitizen(
  citizenId: string,
  payload: CitizenPayload,
): Promise<void> {
  await apiFetch(`/api/v1/citizens/${encodeURIComponent(citizenId)}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteCitizen(citizenId: string): Promise<void> {
  await apiFetch(`/api/v1/citizens/${encodeURIComponent(citizenId)}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function listUserAccounts(): Promise<UserAccountItem[]> {
  const data = await apiFetch<unknown>("/api/v1/users", { auth: true });
  return asList(data).map(mapUserAccount);
}
