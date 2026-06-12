import { useState } from "react";
import Card from "../../../components/ui/Card";
import Icon from "../../../components/icons";
import AttachmentDocumentsTable from "./attachment-documents-table";

const ATTACHMENT_GROUPS = [
  "Đăng ký tạm trú tại chỗ ở hợp pháp do thuê, mượn, ở nhờ",
];

// Khu vực đính kèm giấy tờ. Mỗi nhóm là 1 mục có thể mở/đóng;
// khi mở sẽ hiện bảng giấy tờ cần đính kèm.
export default function AttachmentsSection() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <Card title="Thông tin đề nghị đăng ký tạm trú">
      <p className="text-para-s-regular text-text-placeholder mb-4">
        (*) Vui lòng đính kèm các tệp hình ảnh về các loại giấy tờ sau để giúp
        cơ quan chức năng xác minh và giải quyết nhanh hồ sơ của ông/bà
      </p>

      <div className="flex flex-col">
        {ATTACHMENT_GROUPS.map((label) => {
          const open = openGroup === label;
          return (
            <div key={label} className="border-t border-b border-divider">
              <button
                type="button"
                onClick={() => setOpenGroup(open ? null : label)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-para-s-medium text-text-main"
              >
                {label}
                <Icon
                  name={open ? "chevron-up" : "chevron-down"}
                  size={18}
                  className="shrink-0 text-text-placeholder"
                />
              </button>

              {open && (
                <div className="pb-4">
                  <AttachmentDocumentsTable />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
