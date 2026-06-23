type LoadingProps = {
  show?: boolean;
};

export default function Loading({ show = true }: LoadingProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85">
      {/* 3.75rem spinner — light-green track, dark-green arc rotating */}
      <div
        className="size-[3.75rem] animate-spin rounded-full bg-green-linear"
        style={{
          WebkitMask:
            "radial-gradient(circle, transparent 1.5625rem, black 1.5625rem)",
          mask: "radial-gradient(circle, transparent 1.5625rem, black 1.5625rem)",
        }}
        role="status"
        aria-label="Đang tải..."
      />
    </div>
  );
}
