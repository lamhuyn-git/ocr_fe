import DashboardKpiBar from "./dashboard-kpi-bar";

export default function DashboardMapSection() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shrink-0" style={{ height: 280 }}>
      {/* Green gradient background simulating map */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#064600] via-[#29780d] to-[#3a9e1a]" />

      {/* Map label tag */}
      <div className="absolute top-5 left-5 z-10">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-para-s-semibold">
          Bản đồ khu vực
        </span>
      </div>

      {/* HCM placeholder shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 opacity-30">
          <svg width="200" height="160" viewBox="0 0 200 160" fill="none">
            <path
              d="M100 10 C60 20 20 50 15 90 C10 130 50 150 80 148 C100 147 110 140 130 145 C160 152 185 130 188 100 C192 65 170 30 140 15 Z"
              fill="white"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            />
          </svg>
          <p className="text-white font-semibold text-lg">Thành phố Hồ Chí Minh</p>
        </div>
      </div>

      {/* KPI bar overlaid at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <DashboardKpiBar />
      </div>
    </div>
  );
}
