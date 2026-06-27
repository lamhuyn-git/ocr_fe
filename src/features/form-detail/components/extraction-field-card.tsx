import { useState } from "react";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import type { ExtractionField, SaveChangeFieldItem } from "../types";

export default function ExtractionFieldCard({
  field,
  selected,
  onSelect,
  onMark,
  onUnmark,
  readOnly = false,
}: {
  field: ExtractionField;
  selected?: boolean;
  onSelect?: (field: ExtractionField) => void;
  onMark?: (item: SaveChangeFieldItem) => void;
  onUnmark?: (id: string) => void;
  readOnly?: boolean;
}) {
  const [markedStatus, setMarkedStatus] = useState<"valid" | "invalid" | null>(
    null,
  );
  const [reopened, setReopened] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onSelect?.(field);
  };

  const handleMark = (status: "valid" | "invalid") => {
    setMarkedStatus(status);
    onMark?.({ id: field.id, status });
  };

  const handleUnmark = () => {
    setMarkedStatus(null);
    setReopened(false);
    onUnmark?.(field.id);
  };

  const displayHistory = field.historyCount;
  const hasConfirm = field.historyCount > 1;
  const showConfirmed = hasConfirm && !reopened;

  return (
    <div
      onClick={handleCardClick}
      className={`flex flex-col gap-3 rounded-xl border bg-white p-3 cursor-pointer transition-colors ${
        selected ? "border-black" : "border-input-border"
      }`}
    >
      {/* Label + badge trạng thái — đổi theo nút đã bấm nếu có */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-para-m-regular text-text-placeholder">
          {field.label}
        </span>
        <Badge status={markedStatus ?? field.status} />
      </div>

      {/* Giá trị trích xuất + giá trị CSDL tham chiếu (db_value, fallback đề xuất) */}
      <div className="w-full flex items-center justify-between gap-2 flex-wrap">
        <span className="text-para-m-medium text-text-main">{field.value}</span>
        {(field.csdlValue ?? field.suggestValue) && (
          <span className="flex items-center gap-2 px-3 py-2 rounded-md bg-grey">
            <span className="text-para-m-regular text-text-placeholder shrink-0">
              CSDL:
            </span>
            <span className="text-para-m-semibold text-text-main">
              "{field.csdlValue ?? field.suggestValue}"
            </span>
          </span>
        )}
      </div>

      {/* Kết quả kiểm tra — chỉ hiện khi chưa có confirm (1 mốc lịch sử) */}
      {!hasConfirm && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-grey">
          <span className="text-para-m-regular text-text-placeholder shrink-0">
            Kết quả kiểm tra:
          </span>
          <span className="text-para-m-semibold text-text-main">
            {field.checkResult}
          </span>
        </div>
      )}

      {/* Đã chốt (>1 mốc, chưa Hoàn tác): hiện người xác nhận + nút Hoàn tác để sửa lại. */}
      {showConfirmed ? (
        <>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-grey">
            <span className="text-para-m-regular text-text-placeholder shrink-0">
              Xác nhận bởi:
            </span>
            <span className="text-para-m-semibold text-text-main truncate">
              {field.confirmedByEmail ?? field.confirmedBy}
            </span>
          </div>
          {!readOnly && (
            <Button
              type="button"
              variant="secondary"
              size="12px"
              text="Hoàn tác"
              className="w-full"
              onClick={() => setReopened(true)}
            />
          )}
        </>
      ) : (
        <>
          {/* Lịch sử (chỉ khi chưa có confirm) — tăng 1 khi field đã được đánh dấu */}
          {!hasConfirm && (
            <span className="text-para-m-medium text-text-placeholder">
              Lịch sử ({displayHistory})
            </span>
          )}

          {/* Hành động: toggle giữa 2 nút đánh dấu ↔ nút Hoàn tác */}
          {!readOnly && (
            <div className="flex items-center gap-2">
              {markedStatus !== null ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="12px"
                  text="Hoàn tác"
                  className="w-full"
                  onClick={handleUnmark}
                />
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="12px"
                    text="Trường không hợp lệ"
                    className="w-full"
                    onClick={() => handleMark("invalid")}
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="12px"
                    text="Trường hợp lệ"
                    className="w-full !bg-primary"
                    onClick={() => handleMark("valid")}
                  />
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
