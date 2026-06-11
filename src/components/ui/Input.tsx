import { useState, type InputHTMLAttributes, type ChangeEventHandler } from "react";
import Icon, { type IconName } from "../icons";

type InputType = "default" | "password";

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  inputType?: InputType;
  showSubIcon?: boolean;
  icon?: IconName; // icon trái
  rightIcon?: IconName; // icon phải (trang trí: calendar, chevron-down...)
  multiline?: boolean; // render <textarea>
  placeholder?: string;
  error?: string; // viền đỏ + message dưới
  hasError?: boolean; // viền đỏ, không message
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export default function Input({
  inputType = "default",
  showSubIcon = false,
  icon,
  rightIcon,
  multiline = false,
  placeholder,
  value,
  onChange,
  className,
  error,
  hasError: hasErrorProp = false,
  disabled,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = inputType === "password";
  const nativeType = isPassword && !showPassword ? "password" : "text";
  const hasError = !!error || hasErrorProp;

  // Viền/nền theo state. Ưu tiên: disabled > error > (default/hover/focus).
  const stateClasses = disabled
    ? "bg-grey-hover text-grey-darker border-input-border cursor-not-allowed opacity-70"
    : hasError
      ? "bg-white border-red"
      : "bg-white border-input-border hover:border-grey-active " +
        "focus-within:border-secondary focus-within:ring-2 focus-within:ring-primary-focus-ring";

  const fieldClasses =
    "flex-1 min-w-0 bg-transparent outline-none text-para-m-regular text-text-main placeholder:text-text-placeholder disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-2 w-full">
      <div
        className={`w-full border rounded-lg px-4 flex gap-3 transition-[border-color,box-shadow] duration-150 ${
          multiline ? "py-3 items-start" : "py-4 items-center"
        } ${stateClasses}`}
      >
        {/* Left icon (không dùng cho textarea) */}
        {!multiline && icon && <Icon name={icon} size={16} className="shrink-0" />}

        {multiline ? (
          <textarea
            rows={2}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`${fieldClasses} resize-none ${className ?? ""}`}
          />
        ) : (
          <input
            {...rest}
            type={nativeType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`${fieldClasses} ${className ?? ""}`}
          />
        )}

        {/* Password eye toggle */}
        {!multiline && isPassword && showSubIcon && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPassword((v) => !v)}
            className="shrink-0 transition-colors disabled:cursor-not-allowed"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <Icon name={showPassword ? "eye-hide" : "eye-show"} size={20} />
          </button>
        )}

        {/* Right icon trang trí (calendar, chevron-down...) */}
        {!multiline && !showSubIcon && rightIcon && (
          <Icon
            name={rightIcon}
            size={18}
            className="shrink-0 text-text-placeholder pointer-events-none"
          />
        )}
      </div>

      {/* Error message — italic đỏ */}
      {error && (
        <p className="text-para-m-regular italic text-red leading-[1.45]">
          {error}
        </p>
      )}
    </div>
  );
}
