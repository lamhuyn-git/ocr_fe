import { useState, type ReactNode } from "react";
import Icon from "../../../components/icons";

type CollapsibleCardProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  active?: boolean; // viền xanh nổi bật khi đang chọn
  rightSlot?: ReactNode; // badge trạng thái ở góc phải
  showIcon?: boolean; // icon tài liệu nền xanh trước tiêu đề
};

// Card accordion dùng chung cho 2 panel (trái/phải) của trang chi tiết hồ sơ.
export default function CollapsibleCard({
  title,
  children,
  defaultOpen = false,
  active = false,
  rightSlot,
  showIcon = true,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-xl border bg-white transition-colors ${
        active ? "border-primary" : "border-input-border"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full px-3 py-3 text-left"
      >
        {showIcon && (
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary shrink-0">
            <Icon
              name="document"
              size={16}
              className="[&_path]:stroke-white"
            />
          </span>
        )}
        <span className="flex-1 text-para-m-semibold text-text-main">
          {title}
        </span>
        {rightSlot}
        <Icon
          name="chevron-down"
          size={16}
          className={`shrink-0 text-text-placeholder transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-3 pb-3 border-t border-input-border pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
