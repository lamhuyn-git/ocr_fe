import Icon from "../../../components/icons";
import ExtractionStatusBadge from "../../../components/ui/extraction-status-badge";
import type { ExtractionField } from "../types";

// Card 1 field ở panel phải: giá trị trích xuất + suggest (BE đề xuất)
// + kết quả kiểm tra + lịch sử + 3 nút hành động.
// Bấm card -> chọn field để vẽ box vị trí lên ảnh CT01.
export default function ExtractionFieldCard({
  field,
  selected,
  onSelect,
}: {
  field: ExtractionField;
  selected?: boolean;
  onSelect?: (field: ExtractionField) => void;
}) {
  return (
    <div
      onClick={() => onSelect?.(field)}
      className={`flex flex-col gap-3 rounded-xl border bg-white p-3 cursor-pointer transition-colors ${
        selected ? "border-black" : "border-input-border"
      }`}
    >
      {/* Label + badge trạng thái */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-para-s-regular text-text-placeholder">
          {field.label}
        </span>
        <ExtractionStatusBadge status={field.status} />
      </div>

      {/* Giá trị trích xuất + 'Gần nhất' (BE đề xuất) */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-para-m-semibold text-text-main">
          {field.value}
        </span>
        {field.suggestValue && (
          <span className="flex items-center gap-2 px-2 py-1 rounded-md bg-grey">
            <span className="text-para-s-regular text-text-placeholder">
              Gần nhất:
            </span>
            <span className="text-para-s-medium text-text-main">
              “{field.suggestValue}”
            </span>
          </span>
        )}
      </div>

      {/* Kết quả kiểm tra */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-grey">
        <span className="text-para-s-regular text-text-placeholder shrink-0">
          Kết quả kiểm tra:
        </span>
        <span className="text-para-s-medium text-text-main">
          {field.checkResult}
        </span>
      </div>

      {/* Lịch sử */}
      <span className="text-para-s-medium text-text-placeholder">
        Lịch sử ({field.historyCount})
      </span>

      {/* Hành động: chấp nhận (xanh, full-width) + chỉnh sửa + lấy gợi ý */}
      <button className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-secondary hover:bg-secondary-hover transition-colors">
        <Icon name="confirm" size={16} className="[&_path]:stroke-white" />
        <span className="text-para-s-semibold text-white">
          Chấp nhận kết quả kiểm tra
        </span>
      </button>
      <div className="flex items-center gap-2">
        <button className="flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg border border-input-border hover:bg-grey transition-colors">
          <Icon name="edit" size={16} className="text-text-placeholder" />
          <span className="text-para-s-semibold text-text-main">
            Chỉnh sửa giá trị hiện tại
          </span>
        </button>
        <button className="flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg border border-input-border hover:bg-grey transition-colors">
          <Icon name="reload" size={16} className="text-text-placeholder" />
          <span className="text-para-s-semibold text-text-main">
            Lấy kết quả gợi ý
          </span>
        </button>
      </div>
    </div>
  );
}
