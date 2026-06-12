import type { ReactNode } from "react";

type NotificationProps = {
  time?: string;
  title: string;
  message: string;
  icon?: ReactNode; // tuỳ chọn — chỉ hiển thị khi truyền vào
};

// Card thông báo kiểu push notification.
export default function Notification({
  time,
  title,
  message,
  icon,
}: NotificationProps) {
  return (
    <div className="flex gap-4 rounded-[0.5rem] bg-white px-6 py-3 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]">
      {icon && <div className="shrink-0">{icon}</div>}

      <div className="min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          {time && (
            <span className="whitespace-nowrap text-sm text-gray-400">
              {time}
            </span>
          )}
        </div>
        <p className="text-para-m-bold text-gray-900">{title}</p>
        <p className="text-para-m-regular text-gray-700">{message}</p>
      </div>
    </div>
  );
}
