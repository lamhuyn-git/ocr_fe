import { useState } from "react";
import provinceMap from "../../../assets/province.png";
import DashboardKpiBar from "./dashboard-kpi-bar";
import Icon from "../../../components/icons";

const ZOOM_MIN = 1;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

type DashboardMapSectionProps = {
  organizationId?: string;
};

export default function DashboardMapSection({
  organizationId,
}: DashboardMapSectionProps) {
  const [zoom, setZoom] = useState(ZOOM_MIN);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const zoomIn = () =>
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = () =>
    setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));

  return (
    <div className="w-full shrink-0 rounded-2xl bg-white p-1 shadow-card">
      <div className="relative w-full overflow-hidden rounded-xl aspect-[1672/400]">
        <img
          src={provinceMap}
          alt="Bản đồ khu vực TP. Hồ Chí Minh"
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-auto"
          draggable={false}
        />

        {/* 2 layer gradient fade */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
          style={{
            background:
              "linear-gradient(to bottom, rgba(98, 216, 255, 0.36), rgba(255, 255, 255, 0))",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(to top, rgba(98, 216, 255, 0.36), rgba(255,255,255,0))",
          }}
        />

        {/* Tag góc trái */}
        <div className="absolute top-5 left-4 z-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-main text-white text-para-s-semibold shadow-card">
            BẢN ĐỒ KHU VỰC
          </span>
        </div>

        {/* Controls góc phải */}
        <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {searchOpen && (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm khu vực..."
                className="h-9 w-44 rounded-lg px-3 bg-white shadow-card text-para-s-regular text-text-main outline-none"
              />
            )}
            <button
              type="button"
              aria-label="Tìm kiếm"
              onClick={() => setSearchOpen((o) => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-card hover:bg-grey-hover transition-colors"
            >
              <Icon
                name="search"
                size={18}
                className="[&_path]:stroke-[#242424]"
              />
            </button>
          </div>

          <div className="flex flex-col rounded-lg bg-white shadow-card overflow-hidden">
            <button
              type="button"
              aria-label="Phóng to"
              onClick={zoomIn}
              disabled={zoom >= ZOOM_MAX}
              className="flex items-center justify-center w-9 h-9 hover:bg-grey-hover disabled:opacity-40 transition-colors"
            >
              <Icon
                name="plus"
                size={18}
                className="[&_path]:stroke-[#242424]"
              />
            </button>
            <div className="h-px bg-divider" />
            <button
              type="button"
              aria-label="Thu nhỏ"
              onClick={zoomOut}
              disabled={zoom <= ZOOM_MIN}
              className="flex items-center justify-center w-9 h-9 hover:bg-grey-hover disabled:opacity-40 transition-colors"
            >
              <Icon
                name="minus"
                size={18}
                className="[&_path]:stroke-[#242424]"
              />
            </button>
          </div>
        </div>

        {/* KPI bar overlaid at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <DashboardKpiBar organizationId={organizationId} />
        </div>
      </div>
    </div>
  );
}
