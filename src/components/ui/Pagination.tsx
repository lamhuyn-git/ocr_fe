import Icon from "../icons";

type PaginationProps = {
  currentPage: number; // trang hiện tại (1-based)
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

// Tạo danh sách trang hiển thị: luôn có trang đầu/cuối + lân cận trang hiện tại,
// chèn "..." vào chỗ ngắt quãng. VD current=1,total=10 -> [1,2,"...",9,10].
function buildPageItems(current: number, total: number): (number | "...")[] {
  const candidates = [
    1,
    2,
    current - 1,
    current,
    current + 1,
    total - 1,
    total,
  ].filter((p) => p >= 1 && p <= total);
  const pages = Array.from(new Set(candidates)).sort((a, b) => a - b);

  const items: (number | "...")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) items.push("...");
    items.push(p);
    prev = p;
  }
  return items;
}

// Phân trang: Previous | các số trang (có "...") | Next.
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = buildPageItems(currentPage, totalPages);

  return (
    <nav
      aria-label="Phân trang"
      className={`flex items-center gap-2 ${className ?? ""}`}
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex items-center gap-1 rounded-xl border border-input-border bg-white px-4 py-2.5 text-para-m-semibold text-text-main transition-colors hover:bg-grey disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="chevron-left" size={16} className="text-text-main" />
        Previous
      </button>

      {items.map((item, i) =>
        item === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-para-m-medium text-text-placeholder"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`min-w-11 rounded-xl px-3 py-2.5 text-para-m-semibold transition-colors ${
              item === currentPage
                ? "bg-secondary text-white"
                : "text-text-main hover:bg-grey"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex items-center gap-1 rounded-xl border border-input-border bg-white px-4 py-2.5 text-para-m-semibold text-text-main transition-colors hover:bg-grey disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <Icon name="chevron-right" size={16} className="text-text-main" />
      </button>
    </nav>
  );
}
