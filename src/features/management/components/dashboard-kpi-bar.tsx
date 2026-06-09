import Icon from "../../../components/icons";
import type { IconName } from "../../../components/icons";

type KpiItem = {
  icon: IconName;
  value: number;
  label: string;
};

const KPI_ITEMS: KpiItem[] = [
  { icon: "timer", value: 13, label: "Hồ sơ mới tiếp nhận" },
  { icon: "document", value: 46, label: "Hồ sơ đang xử lý" },
  { icon: "reload", value: 0, label: "Hồ sơ còn tồn đọng" },
  { icon: "overtime", value: 0, label: "Hồ sơ đã quá hạn" },
  { icon: "confirm", value: 0, label: "Hồ sơ đã hoàn thành" },
];

export default function DashboardKpiBar() {
  return (
    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 gap-2">
      {KPI_ITEMS.map((item, idx) => (
        <div key={idx} className="flex flex-1 items-center gap-4 p-3 rounded-2xl">
          {/* Icon box */}
          <div className="flex items-center justify-center w-[50px] h-[50px] rounded-2xl bg-white/50 shrink-0">
            <Icon name={item.icon} size={24} className="text-primary" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[20px] font-semibold text-text-main leading-none">
                {item.value}
              </span>
              <button className="text-text-placeholder text-para-s-regular leading-none">
                ···
              </button>
            </div>
            <span className="text-para-s-medium text-text-placeholder truncate">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
