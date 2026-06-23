import type { LookupForm } from "../types";

// Dữ liệu giả lập danh sách hồ sơ của công dân (đã nộp + bản nháp).
// id của hồ sơ đầu trùng form thật để "Xem chi tiết" mở được trang detail.
export const MOCK_LOOKUP_FORMS: LookupForm[] = [
  {
    id: "62eddcb8-25f9-4e50-81ff-9ed255e8a4ef",
    code: "62EDDC",
    formType: "Đăng ký tạm trú",
    location: "Số 67 Đường Quang Trung, Phường Gò Vấp, TP. Hồ Chí Minh",
    date: "18/06/2026",
    status: "extracted",
  },
  {
    id: "a1c2e3f4-1111-2222-3333-444455556666",
    code: "A1C2E3",
    formType: "Đăng ký tạm trú",
    location: "Số 12 Đường Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh",
    date: "15/06/2026",
    status: "approved",
  },
  {
    id: "b2d3f4a5-2222-3333-4444-555566667777",
    code: "B2D3F4",
    formType: "Đăng ký tạm trú",
    location: "Số 88 Đường Cách Mạng Tháng 8, Phường 7, TP. Hồ Chí Minh",
    date: "10/06/2026",
    status: "under_review",
  },
  {
    id: "c3e4a5b6-3333-4444-5555-666677778888",
    code: "C3E4A5",
    formType: "Đăng ký tạm trú",
    location: "Số 5 Đường Nguyễn Huệ, Phường Bến Nghé, TP. Hồ Chí Minh",
    date: "02/06/2026",
    status: "rejected",
  },
  {
    id: "d4f5a6b7-4444-5555-6666-777788889999",
    code: "D4F5A6",
    formType: "Đăng ký tạm trú",
    location: "Số 125 Đường Nguyễn Duy Trinh, Phường An Phú, TP. Thủ Đức",
    date: "19/06/2026",
    status: "draft",
  },
  {
    id: "e5a6b7c8-5555-6666-7777-88889999aaaa",
    code: "E5A6B7",
    formType: "Đăng ký tạm trú",
    location: "Số 30 Đường Phan Xích Long, Phường 2, TP. Hồ Chí Minh",
    date: "17/06/2026",
    status: "draft",
  },
];
