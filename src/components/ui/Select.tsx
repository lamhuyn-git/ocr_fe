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
  triggerClassName?: string;
  hasError?: boolean;
  error?: string;
};

export default function Select({
  value,
  options,
  placeholder,
  onChange,
  disabled,
  loading,
  className,
  triggerClassName,
  hasError: hasErrorProp = false,
  error,
}: SelectProps) {
  const hasError = !!error || hasErrorProp;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selected = options.find((o) => o.value === value);
  const isDisabled = disabled || loading;

  // Chuẩn hoá search string
  const noAccent = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();

  const q = noAccent(query.trim());
  const filtered = q
    ? options.filter((o) => noAccent(o.label).includes(q))
    : options;

  const highlightValue = q ? filtered[0]?.value : value;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div ref={ref} className={`relative w-full ${className ?? ""}`}>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => (open ? close() : setOpen(true))}
          className={`w-full flex items-center justify-between gap-2 px-4 py-4 rounded-lg border text-left transition-colors ${
            isDisabled
              ? "bg-grey-hover cursor-not-allowed border-input-border"
              : hasError
                ? "bg-white border-red"
                : "bg-white border-input-border hover:border-secondary"
          } ${triggerClassName ?? ""}`}
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
            {/* Ô search*/}
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
                className="w-full bg-transparent outline-none text-para-m-regular text-text-main placeholder:text-text-placeholder"
              />
            </div>

            {/* Danh sách options đã lọc */}
            <div className="max-h-60 overflow-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-2 text-para-m-regular text-text-placeholder">
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
                    className={`w-full text-left px-4 py-2 text-para-m-medium transition-colors hover:bg-grey ${
                      o.value === highlightValue
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

      {error && (
        <p className="text-para-m-regular italic text-red leading-[1.45]">
          {error}
        </p>
      )}
    </div>
  );
}
