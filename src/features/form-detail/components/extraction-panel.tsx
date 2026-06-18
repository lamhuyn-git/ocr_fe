import ExtractionFieldCard from "./extraction-field-card";
import {
  EXTRACTION_STATUS_CONFIG,
  type ExtractionField,
  type ExtractionSection,
  type ExtractionStatus,
} from "../types";

type ExtractionPanelProps = {
  sections: ExtractionSection[];
  activeId: string; // section đang chọn (đồng bộ panel trái)
  selectedFieldId?: string; // field đang chọn (để vẽ box trên ảnh)
  onSelectField?: (field: ExtractionField) => void;
};

// Panel phải: kết quả trích xuất theo từng field của section đang chọn bên trái.
export default function ExtractionPanel({
  sections,
  activeId,
  selectedFieldId,
  onSelectField,
}: ExtractionPanelProps) {
  const activeFields = sections.find((s) => s.id === activeId)?.fields ?? [];

  return (
    <aside className="bg-white flex flex-col gap-3 w-[30%] shrink-0 h-full overflow-y-auto shadow-[0_0_8px_rgba(182,192,187,0.3)] rounded-[0.5rem]">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2 flex-wrap border-b border-black-light">
        <h3 className="text-text-main text-[0.85rem] font-semibold">
          Kết quả trích xuất:
        </h3>
        <div className="flex items-center gap-2">
          {(Object.keys(EXTRACTION_STATUS_CONFIG) as ExtractionStatus[]).map(
            (s) => (
              <span
                key={s}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${EXTRACTION_STATUS_CONFIG[s].bg} ${EXTRACTION_STATUS_CONFIG[s].text}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${EXTRACTION_STATUS_CONFIG[s].dot}`}
                />
                <span className="text-para-s-medium">
                  {EXTRACTION_STATUS_CONFIG[s].label}
                </span>
              </span>
            ),
          )}
        </div>
      </div>

      {/* Field của section đang chọn (so khớp 1-1 với field online bên trái) */}
      {activeFields.length > 0 ? (
        activeFields.map((field) => (
          <div key={field.id} className="flex flex-col px-4">
            <ExtractionFieldCard
              field={field}
              selected={field.id === selectedFieldId}
              onSelect={onSelectField}
            />
          </div>
        ))
      ) : (
        <p className="text-para-s-regular text-text-placeholder py-4 text-center">
          {activeId === "members"
            ? "Không có thành viên nào cùng thay đổi."
            : "Không có trường trích xuất cho mục này."}
        </p>
      )}
    </aside>
  );
}
