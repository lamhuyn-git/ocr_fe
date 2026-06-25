import {
  useState,
  useRef,
  useEffect,
  type InputHTMLAttributes,
  type ChangeEventHandler,
  type ChangeEvent,
} from "react";
import Icon, { type IconName } from "../icons";
import DatePicker from "./DatePicker";

type InputType = "default" | "password";

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  inputType?: InputType;
  showSubIcon?: boolean;
  icon?: IconName;
  rightIcon?: IconName;
  multiline?: boolean;
  placeholder?: string;
  error?: string;
  hasError?: boolean;
  boxClassName?: string; // class cho khung ngoài (vd chỉnh padding)
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
  boxClassName,
  error,
  hasError: hasErrorProp = false,
  disabled,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const isPassword = inputType === "password";
  const nativeType = isPassword && !showPassword ? "password" : "text";
  const hasError = !!error || hasErrorProp;
  const isCalendar = !multiline && rightIcon === "calendar";

  // Đóng DatePicker khi click ra ngoài.
  useEffect(() => {
    if (!pickerOpen) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setPickerOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [pickerOpen]);

  const handleSelectDate = (v: string) => {
    onChange?.({ target: { value: v } } as ChangeEvent<HTMLInputElement>);
  };

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
      <div ref={wrapRef} className="relative">
        <div
          className={`w-full border rounded-lg px-4 flex gap-3 transition-[border-color,box-shadow] duration-150 ${
            multiline ? "py-3 items-start" : "py-4 items-center"
          } ${stateClasses} ${boxClassName ?? ""}`}
        >
          {/* Left icon */}
          {!multiline && icon && (
            <Icon name={icon} size={16} className="shrink-0" />
          )}

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
              className="shrink-0 flex items-center transition-colors disabled:cursor-not-allowed"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <Icon name={showPassword ? "eye-hide" : "eye-show"} size={16} />
            </button>
          )}

          {/* Right icon */}
          {!multiline &&
            !showSubIcon &&
            rightIcon &&
            (isCalendar ? (
              <Icon
                name="calendar"
                size={16}
                className="text-text-placeholder cursor-pointer"
                onClick={() => setPickerOpen((o) => !o)}
              />
            ) : (
              <Icon
                name={rightIcon}
                size={18}
                className="shrink-0 text-text-placeholder pointer-events-none"
              />
            ))}
        </div>

        {/* DatePicker popup */}
        {isCalendar && pickerOpen && (
          <div className="absolute z-30 top-full right-0 mt-1">
            <DatePicker
              value={typeof value === "string" ? value : undefined}
              onSelect={handleSelectDate}
              onClose={() => setPickerOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-para-m-regular italic text-red leading-[1.45]">
          {error}
        </p>
      )}
    </div>
  );
}
