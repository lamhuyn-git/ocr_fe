import { type ReactNode } from "react";
import Icon from "../../../components/icons";

type CollapsibleCardProps = {
  title: string;
  children: ReactNode;
  active?: boolean; // viền xanh nổi bật + mở nội dung khi đang chọn
  onClick?: () => void; // báo cha set card này active
  rightSlot?: ReactNode; // badge trạng thái ở góc phải
  showIcon?: boolean; // icon tài liệu nền xanh trước tiêu đề
};

export default function CollapsibleCard({
  title,
  children,
  active = false,
  onClick,
  rightSlot,
  showIcon = true,
}: CollapsibleCardProps) {
  // Chỉ mở khi đang active (cha quản lý active đơn-chọn).
  const open = active;

  return (
    <div
      className={`rounded-xl border bg-white transition-colors ${
        active ? "border-black" : "shadow-box"
      }`}
    >
      <button
        type="button"
        onClick={() => onClick?.()}
        className="flex items-center gap-2 w-full px-2 py-2 text-left"
      >
        {showIcon && (
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-linear shrink-0">
            <Icon name="document" size={16} className="[&_path]:stroke-white" />
          </span>
        )}
        <span className="flex-1 text-para-m-semibold text-text-main">
          {title}
        </span>
        {rightSlot}
        <Icon
          name="chevron-down"
          size={12}
          className={`shrink-0 text-text-placeholder transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="p-2 border-t border-input-border">{children}</div>
      )}
    </div>
  );
}
