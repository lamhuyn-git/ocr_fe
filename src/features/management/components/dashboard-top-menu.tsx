import Icon from "../../../components/icons";

type DashboardTopMenuProps = {
  // Đường dẫn breadcrumb (mục cuối là trang hiện tại). Mặc định: ["Cư trú"].
  breadcrumb?: string[];
  // "short" -> 01/05/2026 ; "long" -> Ngày 01 tháng 05 năm 2026.
  dateVariant?: "short" | "long";
};

export default function DashboardTopMenu({
  breadcrumb = ["Cư trú"],
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
      <div className="flex items-center gap-1">
        <Icon name="home" size={16} className="text-text-placeholder" />
        <span className="text-para-s-semibold text-text-placeholder">
          Trang chủ
        </span>
        {breadcrumb.map((item, i) => {
          const isLast = i === breadcrumb.length - 1;
          return (
            <span key={item} className="flex items-center gap-1">
              <span className="text-para-s-semibold text-text-main px-1">
                /
              </span>
              <span
                className={`text-para-s-semibold ${
                  isLast ? "text-text-main" : "text-text-placeholder"
                }`}
              >
                {item}
              </span>
            </span>
          );
        })}
      </div>

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
