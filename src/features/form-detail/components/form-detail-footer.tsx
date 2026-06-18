import Icon from "../../../components/icons";
import type { IconName } from "../../../components/icons";

type FormDetailFooterProps = {
  checkedFields: number;
  totalFields: number;
};

// Thanh hành động dưới cùng trang chi tiết: tiến độ kiểm tra + các nút xử lý hồ sơ.
export default function FormDetailFooter({
  checkedFields,
  totalFields,
}: FormDetailFooterProps) {
  const progress = totalFields > 0 ? (checkedFields / totalFields) * 100 : 0;

  return (
    <footer className="shrink-0 flex items-center justify-between gap-6 border-t border-dashed border-black-light-active bg-white px-6 py-3">
      {/* Tiến độ kiểm tra */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <span className="text-para-s-medium text-text-placeholder shrink-0">
          Đã kiểm tra:
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-grey-hover overflow-hidden">
          <div
            className="h-full rounded-full bg-secondary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-para-s-semibold text-text-main shrink-0">
          {checkedFields} / {totalFields} trường
        </span>
      </div>

      {/* Nút hành động */}
      <div className="flex items-center gap-2">
        <FooterButton icon="reload" label="Trích xuất lại" />
        <FooterButton icon="document" label="Lưu bản nháp" />
        <FooterButton icon="confirm" label="Trả kết quả" primary disabled />
      </div>
    </footer>
  );
}

function FooterButton({
  icon,
  label,
  primary,
  disabled,
}: {
  icon: IconName;
  label: string;
  primary?: boolean;
  disabled?: boolean;
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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-para-s-semibold transition-colors ${variant}`}
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
