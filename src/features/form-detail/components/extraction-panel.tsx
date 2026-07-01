import ExtractionFieldCard from "./extraction-field-card";
import Badge from "../../../components/ui/Badge";
import { splitNotes } from "../split-notes";
import {
  EXTRACTION_STATUS_CONFIG,
  type ExtractionField,
  type ExtractionSection,
  type ExtractionStatus,
  type SaveChangeFieldItem,
} from "../types";

type ExtractionPanelProps = {
  sections: ExtractionSection[];
  activeId: string; // section đang chọn
  selectedFieldId?: string; // field đang chọn
  onSelectField?: (field: ExtractionField) => void;
  onMark?: (item: SaveChangeFieldItem) => void;
  onUnmark?: (id: string) => void;
  reviewNote?: string | null; // hiện khi chưa có kết quả trích xuất
  readOnly?: boolean; // hồ sơ đã trả kết quả → ẩn nút thao tác
};

export default function ExtractionPanel({
  sections,
  activeId,
  selectedFieldId,
  onSelectField,
  onMark,
  onUnmark,
  reviewNote,
  readOnly = false,
}: ExtractionPanelProps) {
  const activeFields = sections.find((s) => s.id === activeId)?.fields ?? [];
  const hasAnyField = sections.some((s) => s.fields.length > 0);

  return (
    <aside className="bg-white flex flex-col gap-3 w-[30%] shrink-0 h-full overflow-y-auto shadow-[0_0_8px_rgba(182,192,187,0.3)] rounded-[0.5rem]">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2 flex-wrap border-b border-black-light">
        <h3 className="text-text-main text-[0.85rem] font-semibold">
          Kết quả so khớp:
        </h3>
        <div className="flex items-center gap-2">
          {(Object.keys(EXTRACTION_STATUS_CONFIG) as ExtractionStatus[]).map(
            (s) => (
              <Badge key={s} status={s} />
            ),
          )}
        </div>
      </div>

      {!hasAnyField ? (
        <div className="mx-4 flex flex-col gap-2 rounded-xl border border-input-border bg-white p-3">
          <p className="text-para-m-regular text-text-placeholder">Ghi chú:</p>
          {splitNotes(reviewNote).length > 0 ? (
            splitNotes(reviewNote).map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-red-light px-3 py-2"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-0.5 shrink-0"
                >
                  <rect width="16" height="16" rx="8" fill="#DC0000" />
                  <path
                    d="M11 5L8 8M8 8L5 5M8 8L11 11M8 8L5 11"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-para-m-medium text-text-main">{note}</p>
              </div>
            ))
          ) : (
            <p className="text-para-m-medium text-text-main">
              Chưa có kết quả trích xuất cho hồ sơ này.
            </p>
          )}
        </div>
      ) : activeFields.length > 0 ? (
        activeFields.map((field) => (
          <div key={field.id} className="flex flex-col px-4">
            <ExtractionFieldCard
              field={field}
              selected={field.id === selectedFieldId}
              onSelect={onSelectField}
              onMark={onMark}
              onUnmark={onUnmark}
              readOnly={readOnly}
            />
          </div>
        ))
      ) : (
        <p className="text-para-m-regular text-text-placeholder py-4 text-center">
          {activeId === "members"
            ? "Không có thành viên nào cùng thay đổi."
            : "Không có trường trích xuất cho mục này."}
        </p>
      )}
    </aside>
  );
}
