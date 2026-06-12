import { useState } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Icon from "../../../components/icons";
import { DOC_FORMATS, RENTAL_ATTACHMENT_DOCS } from "../data/mock-form-data";
import type { AttachmentDoc } from "../types";

// 8 cột: STT | Tên giấy tờ | Hình thức | Tải file mẫu | Khai thác CSDL |
// Đính kèm | Số lượng | Ghi chú
const COLS =
  "grid-cols-[44px_2.4fr_1.1fr_90px_1.7fr_130px_72px_1fr]";

// Bảng giấy tờ cần đính kèm cho 1 nhóm thủ tục.
// Style table giống bảng thành viên hộ gia đình (header vàng nhạt, bo góc).
export default function AttachmentDocumentsTable() {
  const [docs, setDocs] = useState<AttachmentDoc[]>(RENTAL_ATTACHMENT_DOCS);

  const update = (id: string, patch: Partial<AttachmentDoc>) =>
    setDocs((list) =>
      list.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    );

  return (
    <div className="flex flex-col rounded-lg bg-white shadow-card overflow-hidden">
      {/* Header */}
      <div
        className={`grid ${COLS} items-center gap-3 bg-secondary-light px-4 py-3 text-para-s-semibold text-text-main`}
      >
        <span>STT</span>
        <span>
          Tên giấy tờ<span className="text-[#E5392E]">*</span>
        </span>
        <span>
          Hình thức giấy tờ<span className="text-[#E5392E]">*</span>
        </span>
        <span className="text-center">Tải file mẫu</span>
        <span className="text-center leading-tight">
          Khai thác CSDL chuyên ngành/Biểu mẫu điện tử
        </span>
        <span className="text-center">Đính kèm</span>
        <span>Số lượng</span>
        <span>Ghi chú</span>
      </div>

      {/* Rows */}
      {docs.map((d, i) => (
        <div
          key={d.id}
          className={`grid ${COLS} items-start gap-3 px-4 py-4 border-t border-divider ${
            i % 2 === 1 ? "bg-main-light/40" : ""
          }`}
        >
          {/* STT */}
          <span className="text-para-s-medium text-text-main pt-2">
            {i + 1}
          </span>

          {/* Tên giấy tờ + checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={d.checked}
              onChange={(e) => update(d.id, { checked: e.target.checked })}
              className="mt-1 h-4 w-4 shrink-0 accent-primary cursor-pointer"
            />
            <span className="text-para-s-medium text-text-main leading-snug">
              {d.name}
            </span>
          </label>

          {/* Hình thức giấy tờ */}
          <Select
            options={DOC_FORMATS}
            value={d.format}
            onChange={(v) => update(d.id, { format: v })}
            placeholder="Hình thức"
          />

          {/* Tải file mẫu */}
          <div className="flex justify-center pt-1.5">
            {d.hasTemplate && (
              <button
                type="button"
                aria-label="Tải file mẫu"
                className="text-text-placeholder hover:text-text-main transition-colors"
              >
                <Icon name="paperclip" size={18} />
              </button>
            )}
          </div>

          {/* Khai thác CSDL chuyên ngành/Biểu mẫu điện tử */}
          <div className="flex justify-center pt-1">
            {d.hasCsdl && (
              <div className="flex items-center gap-2 rounded-md bg-grey px-2 py-1.5">
                <button
                  type="button"
                  aria-label="Khai thác CSDL chuyên ngành"
                  className="text-text-secondary hover:text-text-main transition-colors"
                >
                  <Icon name="code" size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Biểu mẫu điện tử"
                  className="text-text-secondary hover:text-text-main transition-colors"
                >
                  <Icon name="document" size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Đính kèm */}
          <div className="pt-0.5">
            <label className="inline-flex cursor-pointer items-center rounded-md border border-divider bg-grey px-3 py-2 text-para-s-medium text-text-main hover:bg-secondary-light transition-colors">
              Choose Files
              <input type="file" multiple className="hidden" />
            </label>
          </div>

          {/* Số lượng */}
          <Input
            value={String(d.quantity)}
            onChange={(e) =>
              update(d.id, { quantity: Number(e.target.value) || 0 })
            }
          />

          {/* Ghi chú */}
          <Input
            value={d.note}
            onChange={(e) => update(d.id, { note: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
