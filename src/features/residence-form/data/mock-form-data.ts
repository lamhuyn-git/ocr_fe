import type { SelectOption } from "../types";

// Mock danh mục dùng cho các dropdown. Thay bằng API thật sau.

export const PROVINCES: SelectOption[] = [
  { value: "hcm", label: "Thành phố Hồ Chí Minh" },
  { value: "hn", label: "Thành phố Hà Nội" },
  { value: "dn", label: "Thành phố Đà Nẵng" },
  { value: "ct", label: "Thành phố Cần Thơ" },
];

// Phường theo từng tỉnh/thành.
export const WARDS_BY_PROVINCE: Record<string, SelectOption[]> = {
  hcm: [
    { value: "tnpa", label: "Phường Tăng Nhơn Phú A" },
    { value: "tnpb", label: "Phường Tăng Nhơn Phú B" },
    { value: "lb", label: "Phường Long Bình" },
    { value: "lt", label: "Phường Linh Trung" },
  ],
  hn: [
    { value: "cg", label: "Phường Cầu Giấy" },
    { value: "dd", label: "Phường Đống Đa" },
  ],
  dn: [{ value: "hc", label: "Phường Hải Châu" }],
  ct: [{ value: "nk", label: "Phường Ninh Kiều" }],
};

// Cơ quan thực hiện suy ra theo phường.
export const AGENCY_BY_WARD: Record<string, string> = {
  tnpa: "Công An Phường Tăng Nhơn Phú",
  tnpb: "Công An Phường Tăng Nhơn Phú B",
  lb: "Công An Phường Long Bình",
  lt: "Công An Phường Linh Trung",
  cg: "Công An Phường Cầu Giấy",
  dd: "Công An Phường Đống Đa",
  hc: "Công An Phường Hải Châu",
  nk: "Công An Phường Ninh Kiều",
};

export const PROCEDURES: SelectOption[] = [
  { value: "tam-tru", label: "Đăng Ký tạm trú" },
  { value: "thuong-tru", label: "Đăng Ký thường trú" },
];

export const GENDERS: SelectOption[] = [
  { value: "nam", label: "Nam" },
  { value: "nu", label: "Nữ" },
  { value: "khac", label: "Khác" },
];

export const NOTIFY_METHODS: SelectOption[] = [
  { value: "portal", label: "Nhận qua cổng thông tin" },
  { value: "email", label: "Nhận qua Email" },
  { value: "sms", label: "Nhận qua SMS" },
];

export const RESULT_METHODS: SelectOption[] = [
  { value: "direct", label: "Nhận trực tiếp" },
  { value: "post", label: "Nhận qua bưu điện" },
];
