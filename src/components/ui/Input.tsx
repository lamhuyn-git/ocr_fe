import { useState, type InputHTMLAttributes } from "react";
import Icon, { type IconName } from "../icons";

type InputType = "default" | "password";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  inputType?: InputType;
  showSubIcon?: boolean;
  icon?: IconName;
  placeholder?: string;
};

export default function Input({
  inputType = "default",
  showSubIcon = false,
  icon,
  placeholder,
  value,
  onChange,
  className,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = inputType === "password";
  const nativeType = isPassword && !showPassword ? "password" : "text";

  return (
    <div
      className="
        w-full bg-white border border-input-border rounded-lg
        px-4 py-4 flex items-center gap-3
        hover:border-secondary
        focus-within:border-secondary focus-within:ring-2 focus-within:ring-primary-focus-ring
        transition-[border-color,box-shadow] duration-150
      "
    >
      {/* Left icon */}
      {icon && (
        <Icon
          name={icon}
          size={20}
          className="shrink-0 text-text-placeholder"
        />
      )}

      {/* Native input */}
      <input
        {...rest}
        type={nativeType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          flex-1 min-w-0 bg-transparent outline-none
          text-para-m-regular text-text-main
          placeholder:text-text-placeholder
          ${className ?? ""}
        `}
      />

      {/* Right sub-icon: eye toggle for password */}
      {isPassword && showSubIcon && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="shrink-0 text-text-placeholder hover:text-text-main transition-colors"
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          <Icon name={showPassword ? "hide" : "show"} size={20} />
        </button>
      )}
    </div>
  );
}
