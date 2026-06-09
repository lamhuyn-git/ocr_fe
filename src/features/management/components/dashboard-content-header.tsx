export default function DashboardContentHeader() {
  return (
    <div className="flex items-center justify-between shrink-0">
      {/* Left: title + badge + subtitle */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-h2 text-text-main">Quản lý Cư trú</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-light text-para-s-semibold text-primary">
            59
          </span>
        </div>
        <p className="text-para-s-regular text-text-placeholder">
          Xác nhận kết quả AI trước khi ra quyết định
        </p>
      </div>

      {/* Right: filter dropdowns */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-para-s-medium text-text-placeholder whitespace-nowrap">
            Tỉnh/Thành phố
          </span>
          <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-input-border rounded-lg min-w-[160px] shadow-[0_0_4px_rgba(182,192,187,0.25)]">
            <span className="text-para-s-medium text-text-main">Hà Nội</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="shrink-0">
              <path d="M1 1l5 5 5-5" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-para-s-medium text-text-placeholder whitespace-nowrap">
            Phường/Xã
          </span>
          <button className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-input-border rounded-lg min-w-[160px] shadow-[0_0_4px_rgba(182,192,187,0.25)]">
            <span className="text-para-s-medium text-text-main">Long Bình</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="shrink-0">
              <path d="M1 1l5 5 5-5" stroke="#707071" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
