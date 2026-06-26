import Icon from "../../../components/icons";
import type { IconName } from "../../../components/icons";

type FormDetailFooterProps = {
  checkedFields: number;
  totalFields: number;
  onReextract?: () => void;
  reextracting?: boolean;
  onReturnResult?: () => void;
  onSaveDraft?: () => void;
};

export default function FormDetailFooter({
  checkedFields,
  totalFields,
  onReextract,
  reextracting,
  onReturnResult,
  onSaveDraft,
}: FormDetailFooterProps) {
  const progress = totalFields > 0 ? (checkedFields / totalFields) * 100 : 0;
  // Đủ điều kiện trả kết quả khi đã duyệt hết field.
  // (0/0 — vd gate_rejected không có field — cũng tính là "đủ" → active.)
  const canSubmit = checkedFields >= totalFields;

  return (
    <footer className="shrink-0 flex items-center justify-between gap-6 border-t border-dashed border-black-light-active bg-white px-6 py-3">
      {/* Tiến độ kiểm tra */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <span className="text-para-m-medium text-text-placeholder shrink-0">
          Đã kiểm tra:
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-grey-hover overflow-hidden">
          <div
            className="h-full rounded-full bg-secondary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-para-m-semibold text-text-main shrink-0">
          {checkedFields} / {totalFields} trường
        </span>
      </div>

      {/* Nút hành động */}
      <div className="flex items-center gap-2">
        <FooterButton
          icon="reload"
          label={reextracting ? "Đang trích xuất..." : "Trích xuất lại"}
          onClick={onReextract}
          disabled={reextracting}
        />
        <FooterButton
          icon="document"
          label="Lưu bản nháp"
          onClick={onSaveDraft}
        />
        <FooterButton
          icon="confirm"
          label="Trả kết quả"
          primary
          disabled={!canSubmit}
          onClick={onReturnResult}
        />
      </div>
    </footer>
  );
}

function FooterButton({
  icon,
  label,
  primary,
  disabled,
  onClick,
}: {
  icon: IconName;
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const variant = disabled
    ? "bg-grey text-text-placeholder cursor-not-allowed"
    : primary
      ? "bg-secondary text-white hover:bg-secondary-hover"
      : "border border-input-border text-text-main hover:bg-grey";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-para-m-semibold transition-colors ${variant}`}
    >
      <Icon
        name={icon}
        size={16}
        className={
          !disabled && primary
            ? "[&_path]:stroke-white"
            : "text-text-placeholder"
        }
      />
      {label}
    </button>
  );
}
