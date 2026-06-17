export type DocumentStatus =
  | "pending"
  | "processing"
  | "reviewing"
  | "completed"
  | "overdue";

export type DocumentRecord = {
  id: string;
  status: string;
  submittedDate: string;
  handler: string;
  formType: string;
  extractedSections: string[];
};

export const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; bg: string; text: string }
> = {
  pending: {
    label: "Chưa xử lý",
    bg: "bg-yellow-light",
    text: "text-yellow-hover",
  },
  processing: {
    label: "Đang xử lý",
    bg: "bg-[#e8f4fd]",
    text: "text-[#2196f3]",
  },
  reviewing: {
    label: "Đang kiểm tra",
    bg: "bg-[#fff3e0]",
    text: "text-[#f57c00]",
  },
  completed: {
    label: "Hoàn thành",
    bg: "bg-[#e8f5e9]",
    text: "text-[#388e3c]",
  },
  overdue: { label: "Quá hạn", bg: "bg-red-light", text: "text-red" },
};

export const MOCK_DOCUMENTS: DocumentRecord[] = [
  {
    id: "0000001",
    status: "pending",
    submittedDate: "12/05/2025",
    handler: "Nguyễn Văn A",
    formType: "Mẫu CT01",
    extractedSections: [
      "Thông tin người đề nghị đăng ký tạm trú",
      "Thông tin đề nghị đăng ký tạm trú",
    ],
  },
  {
    id: "0000002",
    status: "reviewing",
    submittedDate: "11/05/2025",
    handler: "Trần Thị B",
    formType: "Mẫu CT02",
    extractedSections: [
      "Thông tin người đề nghị đăng ký thường trú",
      "Thông tin đề nghị đăng ký thường trú",
    ],
  },
  {
    id: "0000003",
    status: "processing",
    submittedDate: "10/05/2025",
    handler: "Lê Văn C",
    formType: "Mẫu CT01",
    extractedSections: [
      "Thông tin người đề nghị đăng ký tạm trú",
      "Danh sách người cùng đăng ký",
    ],
  },
  {
    id: "0000004",
    status: "completed",
    submittedDate: "09/05/2025",
    handler: "Phạm Thị D",
    formType: "Mẫu CT03",
    extractedSections: ["Thông tin người đề nghị", "Thông tin địa chỉ cư trú"],
  },
  {
    id: "0000005",
    status: "overdue",
    submittedDate: "01/05/2025",
    handler: "Nguyễn Văn A",
    formType: "Mẫu CT01",
    extractedSections: [
      "Thông tin người đề nghị đăng ký tạm trú",
      "Thông tin đề nghị đăng ký tạm trú",
    ],
  },
  {
    id: "0000006",
    status: "pending",
    submittedDate: "12/05/2025",
    handler: "Trần Thị B",
    formType: "Mẫu CT02",
    extractedSections: [
      "Thông tin người đề nghị đăng ký thường trú",
      "Thông tin đề nghị đăng ký thường trú",
    ],
  },
  {
    id: "0000007",
    status: "processing",
    submittedDate: "08/05/2025",
    handler: "Lê Văn C",
    formType: "Mẫu CT01",
    extractedSections: [
      "Thông tin người đề nghị đăng ký tạm trú",
      "Danh sách người cùng đăng ký",
    ],
  },
  {
    id: "0000008",
    status: "reviewing",
    submittedDate: "07/05/2025",
    handler: "Phạm Thị D",
    formType: "Mẫu CT03",
    extractedSections: ["Thông tin người đề nghị", "Thông tin địa chỉ cư trú"],
  },
];
