import Icon from "../../icons";

export type BreadcrumbItemType = "home" | "separator";

type BreadcrumbItemProps = {
  label: string;
  type?: BreadcrumbItemType;
  active?: boolean;
  onClick?: () => void;
};

export default function BreadcrumbItem({
  label,
  type = "separator",
  active = false,
  onClick,
}: BreadcrumbItemProps) {
  const textClass = active
    ? "text-para-m-semibold text-text-main"
    : "text-para-m-medium text-text-placeholder";

  return (
    <button type="button" onClick={onClick} className="flex items-center gap-1">
      {type === "home" ? (
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
