import { iconMap, type IconName } from "./icon-data";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

/**
 * Generic icon renderer. Pulls SVG content from icon-data.tsx.
 * Each icon in iconMap returns a full <svg> element, so we wrap in a
 * sized <span> and let the inner SVG scale to fill it.
 */
export default function Icon({ name, size = 20, className }: IconProps) {
  const Content = iconMap[name];
  if (!Content) return null;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full ${className ?? ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Content />
    </span>
  );
}

export type { IconName };
