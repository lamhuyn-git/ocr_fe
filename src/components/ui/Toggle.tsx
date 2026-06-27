type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
};

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      {label && (
        <span className="text-para-s-regular text-text-placeholder">{label}</span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-grey-active"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </button>
    </label>
  );
}
