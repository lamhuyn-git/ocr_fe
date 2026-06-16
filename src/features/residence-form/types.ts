export type SelectOption = { value: string; label: string };

// Thành viên hộ gia đình (1 dòng trong bảng)
export type Member = {
  id: string;
  fullName: string;
  birthday: string;
  gender: string;
  idNumber: string;
  relationship: string;
};

// Chi tiết công dân lấy từ CSDL dân cư (BE: CitizenResponse).
export type CitizenDetail = {
  id: string;
  userId: string;
  nationalId: string; // so_dinh_danh
  fullName: string; // ho_chu_dem_va_ten
  birthday: string; // ngay_sinh
  gender: string; // gioi_tinh
  phone: string; // so_dien_thoai
  email: string;
  isActive: boolean; // is_active
};

export type ApplicantType = "self" | "proxy";

// 1 dòng giấy tờ trong bảng đính kèm (theo nhóm thủ tục).
export type AttachmentDoc = {
  id: string;
  name: string; // tên giấy tờ
  checked: boolean; // cột chọn (checkbox)
  format: string; // hình thức giấy tờ (Bản gốc/Bản sao…)
  hasTemplate: boolean; // có file mẫu để tải (icon ghim)
  hasCsdl: boolean; // có khai thác CSDL/biểu mẫu điện tử
  quantity: number; // số lượng
  note: string; // ghi chú
  files: File[]; // ảnh người dùng chọn cho dòng giấy tờ này (upload lúc nộp)
  kind: string; // hint loại ảnh gửi BE để đặt key (vd "CT01" cho tờ khai cần OCR)
};

// Dữ liệu người đề nghị (dùng chung giữa ApplicantInfo & ResidenceRequest).
export type ApplicantForm = {
  fullName: string;
  birthday: string;
  gender: string;
  nationalId: string;
  phone: string;
  email: string;
};
