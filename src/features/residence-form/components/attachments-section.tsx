import { useEffect, useState } from "react";
import Card from "../../../components/ui/Card";
import Icon from "../../../components/icons";
import AttachmentDocumentsTable from "./attachment-documents-table";
import { RENTAL_ATTACHMENT_DOCS } from "../data/mock-form-data";
import type { AttachmentDoc } from "../types";
import type { UploadItem } from "../services/upload-api";

const ATTACHMENT_GROUPS = [
  "Đăng ký tạm trú tại chỗ ở hợp pháp do thuê, mượn, ở nhờ",
];

// Khu vực đính kèm giấy tờ. Mỗi nhóm là 1 mục có thể mở/đóng;
// khi mở sẽ hiện bảng giấy tờ cần đính kèm.
// State `docs` đặt ở đây (không ở table) để file đã chọn không mất khi đóng group.
export default function AttachmentsSection({
  onChange,
  error,
}: {
  onChange?: (items: UploadItem[]) => void;
  error?: boolean;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [docs, setDocs] = useState<AttachmentDoc[]>(() =>
    RENTAL_ATTACHMENT_DOCS.map((d) => ({ ...d, files: [] })),
  );

  const update = (id: string, patch: Partial<AttachmentDoc>) =>
    setDocs((list) => list.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  // Gom phẳng file đã chọn kèm kind của từng dòng, báo lên parent mỗi khi docs đổi.
  useEffect(() => {
    onChange?.(
      docs.flatMap((d) => d.files.map((file) => ({ file, kind: d.kind }))),
    );
  }, [docs, onChange]);

  return (
    <Card title="Thông tin đề nghị đăng ký tạm trú">
      <p className="text-para-s-regular text-text-placeholder mb-4">
        (*) Vui lòng đính kèm các tệp hình ảnh về các loại giấy tờ sau để giúp
        cơ quan chức năng xác minh và giải quyết nhanh hồ sơ của ông/bà
      </p>

      {error && (
        <p className="text-para-s-regular text-red-500 mb-4">
          Vui lòng đính kèm ít nhất một ảnh giấy tờ.
        </p>
      )}

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
                  <AttachmentDocumentsTable docs={docs} onUpdate={update} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
