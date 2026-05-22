import Icon from "../../../components/icons";

export default function DashboardTopMenu() {
  const today = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between px-4 py-[14px] bg-white border-b border-dashed border-black-light-active shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1">
        <Icon name="home" size={16} className="text-text-placeholder" />
        <span className="text-para-s-semibold text-text-placeholder">Trang chủ</span>
        <span className="text-para-s-semibold text-text-main px-1">/</span>
        <span className="text-para-s-semibold text-text-main">Cư trú</span>
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
          <Icon name="bell" size={16} className="text-text-placeholder" />
        </button>
      </div>
    </div>
  );
}
