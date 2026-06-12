import { useState } from "react";
import Icon from "../icons";

type DatePickerProps = {
  value?: string; // dd/mm/yyyy
  onSelect: (value: string) => void; // dd/mm/yyyy
  onClose: () => void;
};

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

const pad = (n: number) => String(n).padStart(2, "0");
const format = (dt: Date) =>
  `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;

// dd/mm/yyyy -> Date (null nếu rỗng/không hợp lệ).
function parse(v?: string): Date | null {
  if (!v) return null;
  const [d, m, y] = v.split("/").map(Number);
  if (!d || !m || !y) return null;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

// Lịch chọn ngày — phong cách Material 3 (docked).
export default function DatePicker({
  value,
  onSelect,
  onClose,
}: DatePickerProps) {
  const selected = parse(value);
  const today = new Date();
  const init = selected ?? today;
  const [view, setView] = useState({
    y: init.getFullYear(),
    m: init.getMonth(),
  });

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  // getDay(): 0=CN..6=T7 -> đổi sang tuần bắt đầu Thứ 2.
  const leading = (new Date(view.y, view.m, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(leading).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () =>
    setView((v) =>
      v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 },
    );
  const nextMonth = () =>
    setView((v) =>
      v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 },
    );

  const sameCell = (d: number, dt: Date | null) =>
    !!dt &&
    dt.getDate() === d &&
    dt.getMonth() === view.m &&
    dt.getFullYear() === view.y;

  return (
    <div className="w-[320px] rounded-2xl bg-white shadow-card border border-input-border p-3">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-para-s-semibold text-text-main">
          {MONTHS[view.m]} {view.y}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Tháng trước"
            className="p-1.5 rounded-full hover:bg-grey transition-colors"
          >
            <Icon name="chevron-left" size={18} className="text-text-main" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Tháng sau"
            className="p-1.5 rounded-full hover:bg-grey transition-colors"
          >
            <Icon name="chevron-right" size={18} className="text-text-main" />
          </button>
        </div>
      </div>

      {/* Hàng thứ */}
      <div className="grid grid-cols-7 text-center text-para-s-medium text-text-placeholder mb-1">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>

      {/* Lưới ngày */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) =>
          d === null ? (
            <span key={`b${i}`} />
          ) : (
            <div key={d} className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  onSelect(format(new Date(view.y, view.m, d)));
                  onClose();
                }}
                className={`w-9 h-9 rounded-full text-para-s-medium flex items-center justify-center transition-colors ${
                  sameCell(d, selected)
                    ? "bg-primary text-white"
                    : sameCell(d, today)
                      ? "border border-primary text-primary"
                      : "text-text-main hover:bg-grey"
                }`}
              >
                {d}
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
