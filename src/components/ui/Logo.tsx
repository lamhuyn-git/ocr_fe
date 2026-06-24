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
    text: "text-base tracking-[0.02rem]",
    gap: "gap-1",
  },
  Medium: {
    icon: "w-8 h-8",
    text: "text-xs tracking-[0.015rem]",
    gap: "gap-1",
  },
  Small: {
    icon: "w-4 h-4",
    text: "text-[0.375rem] tracking-[0.0075rem]",
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
    <div
      className={`flex items-center text-text-main ${gap} ${className ?? ""}`}
    >
      <img
        src={vextractLogo}
        alt="VExtract logo"
        className={`shrink-0 ${icon}`}
      />
      {showText && (
        <span className={`font-extrabold text-current font-be-vietnam ${text}`}>
          VExtract
        </span>
      )}
    </div>
  );
}
