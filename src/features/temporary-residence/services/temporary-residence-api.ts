import { apiFetch } from "../../../lib/http-client";
import type {
  TempResidenceListItem,
  TempResidencePage,
  TempResidenceQuery,
} from "../types";

type ApiItem = {
  id: string;
  citizen_cccd: string | null;
  citizen_name: string | null;
  phone: string | null;
  chu_ho_cccd: string | null;
  dia_chi: string;
  tu_ngay: string | null;
  den_ngay: string | null;
  reviewer_name: string | null;
  form_id: string | null;
  status: string;
  created_at: string;
};

type ApiResponse = { items: ApiItem[]; total: number };

// "YYYY-MM-DD" (hoặc ISO) -> "dd/MM/yyyy". Cắt phần ngày để tránh lệch múi giờ.
function formatDateOnly(s?: string | null): string | null {
  if (!s) return null;
  const [y, m, d] = s.slice(0, 10).split("-");
  if (!y || !m || !d) return s;
  return `${d}/${m}/${y}`;
}

function toItem(item: ApiItem): TempResidenceListItem {
  return {
    id: item.id,
    citizenCccd: item.citizen_cccd,
    citizenName: item.citizen_name,
    phone: item.phone,
    chuHoCccd: item.chu_ho_cccd,
    diaChi: item.dia_chi,
    tuNgay: formatDateOnly(item.tu_ngay),
    denNgay: formatDateOnly(item.den_ngay),
    reviewerName: item.reviewer_name,
    formId: item.form_id,
    status: item.status,
    createdAt: item.created_at,
  };
}

// Lấy 1 trang bản ghi tạm trú (server-side: scope theo phường + phân trang + tìm kiếm).
export async function fetchTemporaryResidences({
  orgId,
  status,
  q = "",
  page = 1,
}: TempResidenceQuery = {}): Promise<TempResidencePage> {
  const params = new URLSearchParams({
    page: String(page),
  });
  if (orgId) params.set("org_id", orgId);
  if (status) params.set("status", status);
  if (q.trim()) params.set("q", q.trim());

  const res = await apiFetch<ApiResponse>(
    `/api/v1/temporary-residences?${params.toString()}`,
    { auth: true },
  );
  return { items: res.items.map(toItem), total: res.total };
}
