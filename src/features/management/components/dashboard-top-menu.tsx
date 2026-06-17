import Icon from "../../../components/icons";
import Breadcrumb, {
  type BreadcrumbEntry,
} from "../../../components/ui/breadcrumb/breadcrumb";

type DashboardTopMenuProps = {
  // Các mục breadcrumb sau "Trang chủ" (mục cuối là trang hiện tại).
  // Mỗi mục có thể kèm onClick để điều hướng.
  breadcrumb?: BreadcrumbEntry[];
  // "short" -> 01/05/2026 ; "long" -> Ngày 01 tháng 05 năm 2026.
  dateVariant?: "short" | "long";
};

export default function DashboardTopMenu({
  breadcrumb = [{ label: "Cư trú" }],
  dateVariant = "short",
}: DashboardTopMenuProps) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const today =
    dateVariant === "long"
      ? `Ngày ${pad(now.getDate())} tháng ${pad(now.getMonth() + 1)} năm ${now.getFullYear()}`
      : now.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

  return (
    <div className="flex items-center justify-between px-4 py-[14px] bg-white border-b border-dashed border-black-light-active shrink-0">
      {/* Item đầu "Trang chủ" (home) + các mục breadcrumb truyền vào. */}
      <Breadcrumb items={[{ label: "Trang chủ" }, ...breadcrumb]} />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-grey transition-colors">
          <Icon name="calendar" size={16} className="text-text-placeholder" />
          <span className="text-para-s-semibold text-text-placeholder">
            Ngày {today}
          </span>
        </button>
        <button className="flex items-center justify-center p-2 rounded-lg hover:bg-grey transition-colors">
          <Icon
            name="notification"
            size={16}
            className="text-text-placeholder"
          />
        </button>
      </div>
    </div>
  );
}
