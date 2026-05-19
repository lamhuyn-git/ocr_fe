import vextractLogo from "../../assets/vextract-logo.svg";

type LogoSize = "Large" | "Medium" | "Small";

type LogoProps = {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
};

const sizeConfig = {
  Large: {
    icon: "w-12 h-12",
    text: "text-base tracking-[0.32px]",
    gap: "gap-1",
  },
  Medium: { icon: "w-8 h-8", text: "text-xs tracking-[0.24px]", gap: "gap-1" },
  Small: {
    icon: "w-4 h-4",
    text: "text-[6px] tracking-[0.12px]",
    gap: "gap-0.5",
  },
};

export default function Logo({
  size = "Large",
  showText = true,
  className,
}: LogoProps) {
  const { icon, text, gap } = sizeConfig[size];

  return (
    <div className={`flex items-center ${gap} ${className ?? ""}`}>
      <img
        src={vextractLogo}
        alt="VExtract logo"
        className={`shrink-0 ${icon}`}
      />
      {showText && (
        <span
          className={`font-extrabold text-text-main font-be-vietnam ${text}`}
        >
          VExtract
        </span>
      )}
    </div>
  );
}
