import { type ButtonHTMLAttributes } from "react";
import Icon, { type IconName } from "../icons";

type ButtonSize = "14px" | "12px";
type ButtonVariant = "primary" | "secondary" | "tertiary";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  type?: "button" | "submit" | "reset";
  size?: ButtonSize;
  variant?: ButtonVariant;
  text?: string;
  showIcon?: boolean;
  icon?: IconName;
  showSubIcon?: boolean;
  subIcon?: IconName;
  className?: string;
};

const sizeStyles: Record<ButtonSize, { wrapper: string; icon: number }> = {
  "14px": {
    wrapper: "px-4 py-4 text-para-m-semibold gap-2 rounded-lg",
    icon: 20,
  },
  "12px": {
    wrapper: "px-4 py-3 text-para-s-semibold gap-1.5 rounded-md",
    icon: 16,
  },
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-light " +
    "hover:bg-primary-hover " +
    "disabled:bg-main-light disabled:text-text-disabled",

  secondary:
    "bg-white border border-primary-light text-text-main shadow-card " +
    "hover:shadow-option " +
    "disabled:shadow-none disabled:border-beige-active disabled:text-text-disabled",

  tertiary:
    "bg-transparent text-primary underline-offset-2 " +
    "hover:underline " +
    "disabled:text-text-disabled",
};

export default function Button({
  type = "button",
  size = "14px",
  variant = "primary",
  text,
  showIcon = false,
  icon = "chevron-right",
  showSubIcon = false,
  subIcon = "chevron-right",
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const { wrapper, icon: iconSize } = sizeStyles[size];
  // primary: icon ăn theo màu chữ (currentColor) thay vì màu stroke cứng của icon.
  const iconColor = variant === "primary" ? "[&_path]:stroke-current" : "";

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center
        font-bold transition-[background-color,box-shadow,color,opacity]
        disabled:cursor-not-allowed
        ${wrapper}
        ${variantStyles[variant]}
        ${className ?? ""}
      `}
    >
      {showIcon && icon && (
        <Icon name={icon} size={iconSize} className={`shrink-0 ${iconColor}`} />
      )}

      <span className="leading-none">{text ?? children}</span>

      {showSubIcon && subIcon && (
        <Icon
          name={subIcon}
          size={iconSize}
          className={`shrink-0 ${iconColor}`}
        />
      )}
    </button>
  );
}
