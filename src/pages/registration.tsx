export default function RegistrationPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-grey">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-12 py-10 shadow-[0_0_16px_rgba(182,192,187,0.3)]">
        <h1 className="text-h1 text-text-main">Form đăng ký</h1>
        <p className="text-para-m-regular text-text-placeholder">
          Nội dung form đăng ký sẽ được hiển thị tại đây.
        </p>
      </div>
    </div>
  );
}
