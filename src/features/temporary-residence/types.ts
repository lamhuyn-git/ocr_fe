// Một bản ghi tạm trú đã cấp (kết quả của hồ sơ được cán bộ duyệt hợp lệ).
export type TempResidenceListItem = {
  id: string;
  citizenCccd: string | null; // ĐDCN người tạm trú
  citizenName: string | null;
  phone: string | null; // số điện thoại
  chuHoCccd: string | null; // ĐDCN chủ hộ
  diaChi: string; // địa chỉ đăng ký
  tuNgay: string | null; // dd/MM/yyyy
  denNgay: string | null; // dd/MM/yyyy
  reviewerName: string | null; // cán bộ tiếp nhận
  formId: string | null; // hồ sơ nguồn → /form-detail
  status: string; // valid | require_adjust
  createdAt: string; // ISO
};

export type TempResidencePage = {
  items: TempResidenceListItem[];
  total: number;
};

export type TempResidenceQuery = {
  orgId?: string; // phường/xã (org_id) để lọc
  status?: string;
  q?: string; // tìm theo CCCD / họ tên / SĐT
  page?: number;
};
