import { iconMap, type IconName } from "./icon-data";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
  onClick?: () => void;
};

/**
 * Generic icon renderer. Pulls SVG content from icon-data.tsx.
 * Each icon in iconMap returns a full <svg> element, so we wrap in a
 * sized <span> and let the inner SVG scale to fill it.
 *
 * `size` is given in design pixels (Figma units) and rendered as rem
 * (size / 16) so icons scale together with the rest of the UI via the
 * root font-size.
 */
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
