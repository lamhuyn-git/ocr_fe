import type { FormStatusKey } from "../../components/ui/Status";

// 1 hồ sơ trong trang "Tra cứu hồ sơ" của công dân (đã nộp hoặc bản nháp).
export type LookupForm = {
  id: string;
  code: string; // mã hồ sơ hiển thị
  formType: string; // loại thủ tục, vd "Đăng ký tạm trú"
  location: string; // địa chỉ đăng ký
  date: string; // ngày nộp / cập nhật (dd/MM/yyyy)
  status: FormStatusKey; // draft | submitted | extracted | approved | ...
};
