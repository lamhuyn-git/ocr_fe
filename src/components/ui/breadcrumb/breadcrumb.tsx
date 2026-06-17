import BreadcrumbItem from "./breadcrumb-item";

export type BreadcrumbEntry = {
  label: string;
  onClick?: () => void;
};

type BreadcrumbProps = {
  // Danh sách item (custom số lượng). Item đầu render type "home",
  // các item sau render type "separator". Item cuối active.
  items: BreadcrumbEntry[];
  className?: string;
};

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-1 ${className ?? ""}`}
    >
      {items.map((item, i) => (
        <BreadcrumbItem
          key={`${item.label}-${i}`}
          label={item.label}
          type={i === 0 ? "home" : "separator"}
          active={i === items.length - 1}
          onClick={item.onClick}
        />
      ))}
    </nav>
  );
}
