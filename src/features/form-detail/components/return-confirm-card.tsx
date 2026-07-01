export type ReturnConfirmInfo = {
  outcome: "valid" | "require_adjust" | null;
  byName: string | null;
  byEmail: string | null;
  at: string | null;
};

function formatConfirmDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())} ${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}`;
}

export default function ReturnConfirmCard({
  info,
}: {
  info: ReturnConfirmInfo;
}) {
  const isValid = info.outcome === "valid";
  return (
    <div className="flex flex-col gap-3 mt-3 rounded-xl border border-input-border bg-white p-4  shadow-[0_0_8px_rgba(182,192,187,0.3)]">
      <span className="text-para-m-semibold text-text-main">
        Thông tin xác nhận hồ sơ
      </span>
      <div className="flex items-center gap-3">
        <span className="w-40 shrink-0 text-para-m-regular text-text-placeholder">
          Trạng thái hồ sơ trả về
        </span>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-para-s-semibold ${
            isValid ? "bg-main-light text-secondary" : "bg-red-light text-red"
          }`}
        >
          {isValid ? "Hồ sơ hợp lệ" : "Hồ sơ không hợp lệ"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-40 shrink-0 text-para-m-regular text-text-placeholder">
          Người xác nhận:
        </span>
        <span className="flex-1 rounded-lg bg-grey px-3 py-2 text-para-m-medium text-text-main">
          {info.byName ?? info.byEmail ?? "—"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-40 shrink-0 text-para-m-regular text-text-placeholder">
          Thời gian xác nhận:
        </span>
        <span className="flex-1 rounded-lg bg-grey px-3 py-2 text-para-m-medium text-text-main">
          {formatConfirmDate(info.at)}
        </span>
      </div>
    </div>
  );
}
