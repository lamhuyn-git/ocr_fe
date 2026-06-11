import { useState, useRef, useEffect } from "react";
import Icon from "../icons";
import type { SelectOption } from "../../features/residence-form/types";

type SelectProps = {
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export default function Select({
  value,
  options,
  placeholder,
  onChange,
  disabled,
  loading,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // từ khoá autofill/search
  const ref = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  // Đóng dropdown khi click ra ngoài.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value);
  const isDisabled = disabled || loading;

  // Lọc options theo từ khoá (không phân biệt hoa thường).
  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.label.toLowerCase().includes(q))
    : options;

  return (
    <div ref={ref} className={`relative w-full ${className ?? ""}`}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => (open ? close() : setOpen(true))}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-lg border border-input-border text-left transition-colors ${
          isDisabled
            ? "bg-grey cursor-not-allowed"
            : "bg-white hover:border-secondary"
        }`}
      >
        <span
          className={`text-para-m-regular truncate ${
            selected ? "text-text-main" : "text-text-placeholder"
          }`}
        >
          {loading ? "Đang tải..." : selected ? selected.label : placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={16}
          className={`shrink-0 text-text-placeholder transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !isDisabled && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-input-border bg-white shadow-card overflow-hidden">
          {/* Ô search (autofill) */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-input-border">
            <Icon
              name="search"
              size={16}
              className="shrink-0 text-text-placeholder"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full bg-transparent outline-none text-para-s-regular text-text-main placeholder:text-text-placeholder"
            />
          </div>

          {/* Danh sách options đã lọc */}
          <div className="max-h-60 overflow-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-2 text-para-s-regular text-text-placeholder">
                {options.length === 0 ? "Không có dữ liệu" : "Không tìm thấy"}
              </div>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange?.(o.value);
                    close();
                  }}
                  className={`w-full text-left px-4 py-2 text-para-s-medium transition-colors hover:bg-grey ${
                    o.value === value
                      ? "bg-grey text-text-main"
                      : "text-text-placeholder"
                  }`}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
