import Icon from "../../icons";

// 2 type: "home" (icon nhà) | "separator" (dấu "/" đứng trước nhãn).
export type BreadcrumbItemType = "home" | "separator";

type BreadcrumbItemProps = {
  label: string;
  type?: BreadcrumbItemType;
  active?: boolean; // true: chữ đậm/đen ; false: xám (state mặc định)
  onClick?: () => void;
};

export default function BreadcrumbItem({
  label,
  type = "separator",
  active = false,
  onClick,
}: BreadcrumbItemProps) {
  const textClass = active
    ? "text-para-s-semibold text-text-main"
    : "text-para-s-medium text-text-placeholder";

  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1">
      {type === "home" ? (
        // home icon tô stroke cứng -> đổi màu qua [&_path]:stroke-*.
        <Icon
          name="home"
          size={16}
          className={
            active ? "[&_path]:stroke-[#242424]" : "[&_path]:stroke-[#707071]"
          }
        />
      ) : (
        <span className={`px-1 ${textClass}`}>/</span>
      )}
      <span className={textClass}>{label}</span>
    </button>
  );
}
