type LoginProgressBarProps = {
  step: 1 | 2;
};

export default function LoginProgressBar({ step }: LoginProgressBarProps) {
  return (
    <div className="flex gap-1 items-center">
      <div
        className={`h-1 w-10 rounded-l-lg ${step === 1 ? 'bg-primary' : 'bg-primary-light'}`}
      />
      <div
        className={`h-1 w-10 ${step === 2 ? 'bg-primary' : 'bg-primary-light'}`}
      />
    </div>
  );
}
