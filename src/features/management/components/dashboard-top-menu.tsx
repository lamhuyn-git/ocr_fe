import Icon from "../../../components/icons";
import Breadcrumb, {
  type BreadcrumbEntry,
} from "../../../components/ui/breadcrumb/breadcrumb";
import NotificationBell from "../../notifications/components/notification-bell";

type DashboardTopMenuProps = {
  breadcrumb?: BreadcrumbEntry[];
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
    <div className="flex items-center justify-between px-4 py-[0.875rem] bg-white border-b border-dashed border-black-light-active shrink-0">
      <Breadcrumb items={[{ label: "Trang chủ" }, ...breadcrumb]} />

      <div className="flex items-center gap-1">
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-grey transition-colors">
          <Icon name="calendar" size={16} className="text-text-placeholder" />
          <span className="text-para-m-semibold text-text-placeholder">
            Ngày {today}
          </span>
        </button>
        <NotificationBell iconSize={16} iconClassName="text-text-placeholder" />
      </div>
    </div>
  );
}
