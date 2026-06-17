import { useEffect, useState } from "react";
import Icon from "../../../components/icons";
import type { IconName } from "../../../components/icons";
import {
  currentMonthRange,
  getFormStatusCounts,
  type KpiCounts,
} from "../services/form-list-api";

type KpiItem = {
  icon: IconName;
  key: keyof KpiCounts;
  label: string;
};

const KPI_ITEMS: KpiItem[] = [
  { icon: "timer", key: "received", label: "Hồ sơ mới tiếp nhận" },
  { icon: "document", key: "processing", label: "Hồ sơ đang xử lý" },
  { icon: "reload", key: "backlog", label: "Hồ sơ còn tồn đọng" },
  { icon: "overtime", key: "overdue", label: "Hồ sơ đã quá hạn" },
  { icon: "confirm", key: "completed", label: "Hồ sơ đã hoàn thành" },
];

const EMPTY_COUNTS: KpiCounts = {
  received: 0,
  processing: 0,
  backlog: 0,
  overdue: 0,
  completed: 0,
};

type DashboardKpiBarProps = {
  organizationId?: string;
  typeId?: string;
};

export default function DashboardKpiBar({
  organizationId,
  typeId,
}: DashboardKpiBarProps) {
  const [counts, setCounts] = useState<KpiCounts>(EMPTY_COUNTS);

  useEffect(() => {
    let stale = false;
    const { fromDay, toDay } = currentMonthRange();
    getFormStatusCounts({ organizationId, typeId, fromDay, toDay })
      .then((data) => {
        if (!stale) setCounts(data);
      })
      .catch(() => {
        if (!stale) setCounts(EMPTY_COUNTS);
      });
    return () => {
      stale = true;
    };
  }, [organizationId, typeId]);

  return (
    <div className="flex items-stretch gap-3">
      {/* Gradient stroke dùng chung cho icon KPI (định nghĩa 1 lần, ẩn). */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <linearGradient
            id="kpi-icon-gradient"
            x1="12"
            y1="2.65625"
            x2="12"
            y2="23.2356"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#064600" />
            <stop offset="0.434259" stopColor="#29780D" />
            <stop offset="0.53025" stopColor="#B0E16C" />
            <stop offset="0.638549" stopColor="#29780D" />
            <stop offset="1" stopColor="#064600" />
          </linearGradient>
        </defs>
      </svg>
      {KPI_ITEMS.map((item, idx) => (
        <div
          key={idx}
          className="relative flex flex-1 items-center gap-4 px-2 py-2 rounded-[1rem] bg-gradient-to-b from-white/25 to-white/55 backdrop-blur-xl border-[0.5px] border-white/60 shadow-[0_8px_30px_rgba(19,53,36,0.08),inset_0_1px_0_rgba(255,255,255,0.7)]"
        >
          {/* Icon tile — frosted white với shadow nhẹ */}
          <div className="flex items-center justify-center px-3 py-3 rounded-2xl shrink-0 bg-white/80 border border-white/70 shadow-[0_2px_8px_rgba(19,53,36,0.08)]">
            <Icon name={item.icon} size={20} className="kpi-icon-gradient" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span className="text-[1.15rem] font-semibold text-text-main">
              {counts[item.key]}
            </span>

            <span className="text-para-m-regular text-text-secondary truncate">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
