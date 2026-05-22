type LoadingProps = {
  show?: boolean;
};

export default function Loading({ show = true }: LoadingProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85">
      {/* 60×60 spinner — light-green track, dark-green arc rotating */}
      <div
        className="size-[60px] animate-spin rounded-full bg-green-linear"
        style={{
          WebkitMask: "radial-gradient(circle, transparent 25px, black 25px)",
          mask: "radial-gradient(circle, transparent 25px, black 25px)",
        }}
        role="status"
        aria-label="Đang tải..."
      />
    </div>
  );
}
