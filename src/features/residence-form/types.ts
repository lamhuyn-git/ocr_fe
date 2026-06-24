export type SelectOption = { value: string; label: string };

// Type thông tin người thay đổi cư trú
export type ApplicantForm = {
  fullName: string;
  birthday: string;
  gender: string;
  nationalId: string;
  phone: string;
  email: string;
};

// Type of 1 thành viên trong gia đình cùng thay đổi thông tin cư trú
export type Member = {
  id: string;
  fullName: string;
  birthday: string;
  gender: string;
  idNumber: string;
  relationship: string;
};

// Chi tiết một công dân
export type CitizenDetail = {
  id: string;
  userId: string;
  nationalId: string;
  fullName: string;
  birthday: string;
  gender: string;
  phone: string;
  email: string;
  isActive: boolean;
};

export type ApplicantType = "self" | "proxy";

// Một giấy tờ trong bảng đính kèm
export type AttachmentDoc = {
  id: string;
  name: string; // tên giấy tờ
  format: string; // hình thức giấy tờ (Bản gốc/Bản sao…)
  hasTemplate: boolean; // có file mẫu để tải (icon ghim)
  hasCsdl: boolean; // có khai thác CSDL/biểu mẫu điện tử
  quantity: number; // số lượng
  note: string; // ghi chú
  files: File[]; // ảnh người dùng chọn cho dòng giấy tờ này (upload lúc nộp)
  kind: string; // hint loại ảnh để gửi BE đặt key (vd "CT01" cho tờ khai cần OCR)
};
