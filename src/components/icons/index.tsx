import { iconMap, type IconName } from "./icon-data";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  onClick?: () => void;
};

export default function Icon({
  name,
  size = 20,
  className,
  onClick,
}: IconProps) {
  const Content = iconMap[name];
  if (!Content) return null;

  const remSize = `${size / 16}rem`;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full ${className ?? ""}`}
      style={{ width: remSize, height: remSize }}
      aria-hidden
      onClick={onClick}
    >
      <Content />
    </span>
  );
}

export type { IconName };
