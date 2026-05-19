import { iconMap, type IconName } from "./icon-data";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

/**
 * Generic icon renderer. Pulls SVG content from icon-data.tsx.
 * Inherits color via `currentColor` — control with Tailwind text-* classes.
 */
export default function Icon({ name, size = 20, className }: IconProps) {
  const Content = iconMap[name];
  if (!Content) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <Content />
    </svg>
  );
}

export type { IconName };
