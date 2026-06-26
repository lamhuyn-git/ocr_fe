import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/icons";
import type { AttachmentDoc, SelectOption } from "../types";
import { getTemplateDownloadUrl } from "../services/form-api";

// Tỷ lệ % cho header và row để luôn thẳng hàng.
const COL = {
  stt: "w-[4%]",
  name: "w-[35%]",
  format: "w-[13%]",
  template: "w-[8%]",
  attach: "w-[13%]",
  qty: "w-[7%]",
  note: "w-[20%]",
} as const;

// Hình thức giấy tờ (cột "Hình thức giấy tờ").
export const DOC_FORMATS: SelectOption[] = [
  { value: "ban-goc", label: "Bản gốc" },
  { value: "ban-sao", label: "Bản sao" },
  { value: "ban-sao-cong-chung", label: "Bản sao công chứng" },
];

// Giới hạn file đính kèm, chỉ cho phép ảnh có kích thước ≤ 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type Props = {
  docs: AttachmentDoc[];
  onUpdate: (id: string, patch: Partial<AttachmentDoc>) => void;
};

export default function AttachmentDocumentsTable({ docs, onUpdate }: Props) {
  const handleFiles = (doc: AttachmentDoc, fileList: FileList | null) => {
    if (!fileList) return;
    const valid = Array.from(fileList).filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_FILE_SIZE,
    );
    onUpdate(doc.id, { files: [...doc.files, ...valid] });
  };

  const handleDownloadTemplate = async () => {
    const formName = "Đăng ký tạm trú";
    const { download_url } = await getTemplateDownloadUrl(formName);
    const link = document.createElement("a");
    link.href = download_url;
    link.download = "Mau_CT01.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFile = (doc: AttachmentDoc, index: number) =>
    onUpdate(doc.id, { files: doc.files.filter((_, i) => i !== index) });

  return (
    <div className="flex flex-col rounded-lg bg-white shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center bg-secondary-light px-4 py-3 text-para-m-semibold text-text-main">
        <span className={`${COL.stt} pr-3`}>STT</span>
        <span className={`${COL.name} pr-3`}>
          Tên giấy tờ<span className="text-[#E5392E]">*</span>
        </span>
        <span className={`${COL.format} pr-3`}>
          Hình thức giấy tờ<span className="text-[#E5392E]">*</span>
        </span>
        <span className={`${COL.template} pr-3 text-center`}>Tải file mẫu</span>
        <span className={`${COL.attach} pr-3 text-center`}>Đính kèm</span>
        <span className={`${COL.qty} pr-3`}>Số lượng</span>
        <span className={COL.note}>Ghi chú</span>
      </div>

      {/* Rows */}
      {docs.map((d, i) => (
        <div
          key={d.id}
          className={`flex items-center px-4 py-4 border-t border-divider ${
            i % 2 === 1 ? "bg-main-light/40" : ""
          }`}
        >
          {/* STT */}
          <span className={`${COL.stt} pr-3 text-para-m-medium text-text-main`}>
            {i + 1}
          </span>

          {/* Tên giấy tờ + checkbox */}
          <label
            className={`${COL.name} pr-3 flex items-center gap-3 cursor-pointer`}
          >
            <input
              type="checkbox"
              checked={d.files.length > 0}
              readOnly
              className="h-4 w-4 shrink-0 accent-primary cursor-pointer"
            />
            <span className="text-para-m-medium text-text-main leading-snug">
              {d.name}
            </span>
          </label>

          {/* Hình thức giấy tờ */}
          <div className={`${COL.format} pr-3`}>
            <Select
              options={DOC_FORMATS}
              value={d.format}
              onChange={(v) => onUpdate(d.id, { format: v })}
              placeholder="Hình thức"
            />
          </div>

          {/* Tải file mẫu */}
          <div className={`${COL.template} pr-3 flex justify-center`}>
            {d.hasTemplate && (
              <button
                type="button"
                aria-label="Tải file mẫu"
                onClick={handleDownloadTemplate}
                className="text-text-placeholder hover:text-text-main transition-colors"
              >
                <Icon name="paperclip" size={18} />
              </button>
            )}
          </div>

          <div
            className={`${COL.attach} pr-3 flex flex-col items-center gap-2`}
          >
            <label className="inline-flex cursor-pointer items-center rounded-md border border-divider bg-grey px-3 py-2 text-para-m-medium text-text-main hover:bg-secondary-light transition-colors">
              Choose Files
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  handleFiles(d, e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            {d.files.length > 0 && (
              <ul className="w-full flex flex-col gap-1">
                {d.files.map((f, idx) => (
                  <li
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between gap-1 text-para-m-regular text-text-secondary"
                  >
                    <span className="truncate" title={f.name}>
                      {f.name}
                    </span>
                    <button
                      type="button"
                      aria-label={`Xoá ${f.name}`}
                      onClick={() => removeFile(d, idx)}
                      className="shrink-0 text-text-placeholder hover:text-red transition-colors"
                    >
                      <Icon name="cancel" size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Số lượng */}
          <div className={`${COL.qty} pr-3`}>
            <Input
              value={String(d.quantity)}
              onChange={(e) =>
                onUpdate(d.id, { quantity: Number(e.target.value) || 0 })
              }
            />
          </div>

          {/* Ghi chú */}
          <div className={COL.note}>
            <Input
              value={d.note}
              onChange={(e) => onUpdate(d.id, { note: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
