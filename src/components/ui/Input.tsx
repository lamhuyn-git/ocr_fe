import { useState, type InputHTMLAttributes } from "react";
import Icon, { type IconName } from "../icons";

type InputType = "default" | "password";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  inputType?: InputType;
  showSubIcon?: boolean;
  icon?: IconName;
  placeholder?: string;
  error?: string;    // error border + red icon + message below
  hasError?: boolean; // error border + red icon only, no message
};

export default function Input({
  inputType = "default",
  showSubIcon = false,
  icon,
  placeholder,
  value,
  onChange,
  className,
  error,
  hasError: hasErrorProp = false,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = inputType === "password";
  const nativeType = isPassword && !showPassword ? "password" : "text";
  const hasError = !!error || hasErrorProp;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        className={`
          w-full bg-white border rounded-lg
          px-4 py-4 flex items-center gap-3
          transition-[border-color,box-shadow] duration-150
          ${
            hasError
              ? "border-red"
              : "border-input-border hover:border-secondary focus-within:border-secondary focus-within:ring-2 focus-within:ring-primary-focus-ring"
          }
        `}
      >
        {/* Left icon — red in error state */}
        {icon && (
          <Icon
            name={icon}
            size={16}
            className={`shrink-0 ${hasError ? "text-red" : "text-text-placeholder"}`}
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

        {/* Eye toggle — red tint in error state */}
        {isPassword && showSubIcon && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className={`shrink-0 transition-colors ${
              hasError
                ? "text-red hover:text-red-hover"
                : "text-text-placeholder hover:text-text-main"
            }`}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <Icon name={showPassword ? "hide" : "show"} size={20} />
          </button>
        )}
      </div>

      {/* Error message — italic, red, 14px per Figma */}
      {error && (
        <p className="text-para-m-regular text-red leading-[1.45]">{error}</p>
      )}
    </div>
  );
}
