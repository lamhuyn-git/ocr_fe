import { type TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  hasError?: boolean;
};

// Ô nhập nhiều dòng dùng chung (nền xám nhạt, bo góc, có thể kéo giãn).
export default function Textarea({
  className,
  error,
  hasError: hasErrorProp = false,
  rows = 4,
  disabled,
  ...rest
}: TextareaProps) {
  const hasError = !!error || hasErrorProp;

  const stateClasses = disabled
    ? "bg-grey-hover text-grey-darker cursor-not-allowed opacity-70 border-transparent"
    : hasError
      ? "bg-grey border-red"
      : "bg-grey border-transparent hover:border-grey-active " +
        "focus:border-secondary focus:ring-2 focus:ring-primary-focus-ring";

  return (
    <div className="flex w-full flex-col gap-2">
      <textarea
        rows={rows}
        disabled={disabled}
        className={`w-full resize-y rounded-lg border px-4 py-3 text-para-m-regular text-text-main outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-text-placeholder disabled:cursor-not-allowed ${stateClasses} ${className ?? ""}`}
        {...rest}
      />
      {error && (
        <p className="text-para-m-regular italic text-red leading-[1.45]">
          {error}
        </p>
      )}
    </div>
  );
}
