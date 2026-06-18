import type { FormDetail } from "../types";

// Dữ liệu giả lập cho trang chi tiết hồ sơ (kết quả trích xuất CT01).
export const MOCK_FORM_DETAIL: FormDetail = {
  code: "HS00000000",
  submittedDate: "12/05/2026",
  statusLabel: "Đang xem xét",
  checkedFields: 0,
  totalFields: 36,

  procedure: {
    hinhThuc: "Đăng ký lập hộ mới",
    truongHop: "Đăng ký tạm trú (nhân khẩu,hộ)",
    nguoiKhai: "Là người Đăng ký tạm trú",
  },

  onlineSections: [
    {
      id: "agency",
      title: "Cơ quan thực hiện",
      rows: [{ label: "Cơ quan thực hiện", value: "Công an phường An Phú" }],
    },
    {
      id: "applicant",
      title: "Thông tin hộ thay đổi",
      rows: [
        { label: "Họ và tên", value: "Ngô Anh Hào" },
        { label: "Ngày tháng năm sinh", value: "30/12/1999" },
        { label: "Giới tính", value: "Nam" },
        { label: "Số định danh cá nhân", value: "079256379937" },
        { label: "Số điện thoại", value: "0384659657" },
        { label: "Email", value: "ngoquocson@gmail.com" },
      ],
    },
    {
      id: "request",
      title: "Thông tin đề nghị",
      rows: [
        {
          label: "Nội dung đề nghị",
          value:
            "Đăng ký tạm trú 01 nhân khẩu tại số 125 đường Nguyễn Duy Trinh, phường An Phú, thành phố Thủ Đức, TP.HCM.",
        },
      ],
    },
    {
      id: "members",
      title: "Những thành viên cùng thay đổi",
      rows: [{ label: "Số thành viên", value: "0" }],
    },
  ],

  extractionSections: [
    {
      id: "agency",
      title: "Cơ quan thực hiện",
      fields: [
        {
          id: "agency-name",
          label: "Cơ quan thực hiện",
          value: "Công an phường An Phu",
          suggestValue: "Công an phường An Phú",
          status: "review",
          checkResult: "Không có cơ quan này trong CSDL",
          historyCount: 1,
        },
      ],
    },
    {
      id: "applicant",
      title: "Thông tin hộ thay đổi",
      fields: [
        {
          id: "national-id",
          label: "Số định danh cá nhân",
          value: "079256379937",
          status: "valid",
          checkResult: "Có tồn tại công dân trong CSDL",
          historyCount: 1,
        },
        {
          id: "full-name",
          label: "Họ và tên",
          value: "Ngo Anh Hào",
          suggestValue: "Ngô Anh Hào",
          status: "review",
          checkResult: "Không khớp với CSDL",
          historyCount: 1,
        },
        {
          id: "gender",
          label: "Giới tính",
          value: "Nam",
          status: "valid",
          checkResult: "Khớp với CSDL",
          historyCount: 1,
        },
        {
          id: "birth",
          label: "Ngày tháng năm sinh",
          value: "30/12/1999",
          status: "valid",
          checkResult: "Khớp với CSDL",
          historyCount: 1,
        },
        {
          id: "phone",
          label: "Số điện thoại",
          value: "0384659657",
          status: "valid",
          checkResult: "Khớp với CSDL",
          historyCount: 1,
        },
        {
          id: "email",
          label: "Email",
          value: "ngopngocson@gmail.com",
          suggestValue: "ngoquocson@gmail.com",
          status: "invalid",
          checkResult: "Không khớp với CSDL",
          historyCount: 1,
        },
      ],
    },
    {
      id: "request",
      title: "Thông tin đề nghị",
      fields: [
        {
          id: "request-content",
          label: "Nội dung đề nghị",
          value:
            "Đăng ký tạm trú 01 nhân khẩu tại số 125 đường Nguyễn Duy Trinh, phường An Phú, thành phố Thủ Đức, TP.HCM.",
          status: "valid",
          checkResult: "Hợp lệ",
          historyCount: 1,
        },
      ],
    },
    {
      id: "members",
      title: "Những thành viên cùng thay đổi",
      fields: [],
    },
  ],

  declaration: {
    recipient: "Công an phường An Phú",
    fullName: "Ngô Anh Hào",
    birthday: "30/12/1999",
    gender: "Nam",
    nationalId: "079256379937",
    phone: "0384659657",
    email: "ngoquocson@gmail.com",
    ownerName: "Ngô Anh Hào",
    ownerRelationship: "Chủ hộ",
    ownerNationalId: "079256379937",
    requestContent:
      "Đăng ký tạm trú 01 nhân khẩu tại số 125 đường Nguyễn Duy Trinh, phường An Phú, thành phố Thủ Đức, TP.HCM.",
    members: [],
  },

  evidences: [],
};
