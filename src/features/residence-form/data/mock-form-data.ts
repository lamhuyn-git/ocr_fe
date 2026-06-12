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

// Quan hệ với chủ hộ (Luật Cư trú 2020 + Luật HN&GĐ 2014).
export const RELATIONSHIPS: SelectOption[] = [
  { value: "vo", label: "Vợ" },
  { value: "chong", label: "Chồng" },
  { value: "cha-de", label: "Cha đẻ" },
  { value: "me-de", label: "Mẹ đẻ" },
  { value: "con-de", label: "Con đẻ" },
  { value: "cha-nuoi", label: "Cha nuôi" },
  { value: "me-nuoi", label: "Mẹ nuôi" },
  { value: "con-nuoi", label: "Con nuôi" },
  { value: "cha-duong", label: "Cha dượng" },
  { value: "me-ke", label: "Mẹ kế" },
  { value: "con-rieng", label: "Con riêng của vợ/chồng" },
  { value: "cha-vo", label: "Cha vợ" },
  { value: "me-vo", label: "Mẹ vợ" },
  { value: "cha-chong", label: "Cha chồng" },
  { value: "me-chong", label: "Mẹ chồng" },
  { value: "con-dau", label: "Con dâu" },
  { value: "con-re", label: "Con rể" },
  { value: "ong-noi", label: "Ông nội" },
  { value: "ba-noi", label: "Bà nội" },
  { value: "ong-ngoai", label: "Ông ngoại" },
  { value: "ba-ngoai", label: "Bà ngoại" },
  { value: "chau-noi", label: "Cháu nội" },
  { value: "chau-ngoai", label: "Cháu ngoại" },
  { value: "chau-ruot", label: "Cháu ruột" },
  { value: "cu-noi", label: "Cụ nội" },
  { value: "cu-ngoai", label: "Cụ ngoại" },
  { value: "chat-ruot", label: "Chắt ruột" },
  { value: "anh-ruot", label: "Anh ruột" },
  { value: "chi-ruot", label: "Chị ruột" },
  { value: "em-ruot", label: "Em ruột" },
  { value: "anh-chi-em-cung-cha-khac-me", label: "Anh/chị/em cùng cha khác mẹ" },
  { value: "anh-chi-em-cung-me-khac-cha", label: "Anh/chị/em cùng mẹ khác cha" },
  { value: "anh-re", label: "Anh rể" },
  { value: "em-re", label: "Em rể" },
  { value: "chi-dau", label: "Chị dâu" },
  { value: "em-dau", label: "Em dâu" },
  { value: "bac-ruot", label: "Bác ruột" },
  { value: "chu-ruot", label: "Chú ruột" },
  { value: "cau-ruot", label: "Cậu ruột" },
  { value: "co-ruot", label: "Cô ruột" },
  { value: "di-ruot", label: "Dì ruột" },
];

// Hình thức giấy tờ (cột "Hình thức giấy tờ").
export const DOC_FORMATS: SelectOption[] = [
  { value: "ban-goc", label: "Bản gốc" },
  { value: "ban-sao", label: "Bản sao" },
  { value: "ban-sao-cong-chung", label: "Bản sao công chứng" },
];

// Giấy tờ cần đính kèm cho thủ tục "Đăng ký tạm trú tại chỗ ở hợp pháp
// do thuê, mượn, ở nhờ" (UI tĩnh trước; thay bằng API sau).
export const RENTAL_ATTACHMENT_DOCS = [
  {
    id: "1",
    name: "Tờ khai thay đổi thông tin cư trú",
    checked: false,
    format: "ban-goc",
    hasTemplate: true,
    hasCsdl: false,
    quantity: 0,
    note: "",
  },
  {
    id: "2",
    name:
      "Giấy tờ, tài liệu chứng minh chỗ ở hợp pháp (1 trong các giấy tờ được " +
      "quy định tại khoản 3 Điều 5, Nghị định số 154/2024/NĐ-CP quy định chi " +
      "tiết một số điều và biện pháp thi hành luật cư trú ngày 26 tháng 11 năm 2024)",
    checked: true,
    format: "ban-goc",
    hasTemplate: false,
    hasCsdl: true,
    quantity: 0,
    note: "",
  },
];
