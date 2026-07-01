import { useEffect, useRef, useState } from "react";
import Icon from "../../../components/icons";
import Toggle from "../../../components/ui/Toggle";
import { useNotifications } from "../notification-store";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ngày ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

type Props = {
  iconClassName?: string;
  iconSize?: number;
};

export default function NotificationBell({
  iconClassName = "text-text-placeholder",
  iconSize = 16,
}: Props) {
  const { items, unread, markOneRead, refresh } = useNotifications();
  const [open, setOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleOpen() {
    setOpen((o) => {
      const next = !o;
      if (next) void refresh();
      return next;
    });
  }

  const list = unreadOnly ? items.filter((n) => !n.is_read) : items;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      )}
      <div ref={ref} className="relative z-50">
        <button
          type="button"
          onClick={toggleOpen}
          className="relative flex items-center justify-center p-2 rounded-lg hover:bg-grey/20 transition-colors"
        >
          <Icon name="notification" size={iconSize} className={iconClassName} />
          {unread > 0 && (
            <span className="absolute top-0 right-0 min-w-[1.05rem] h-[1.05rem] px-1 rounded-full bg-red text-white text-[0.625rem] font-semibold flex items-center justify-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-[28rem] h-[90vh] overflow-auto rounded-2xl bg-white shadow-card z-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-para-m-semibold uppercase tracking-wide text-text-main">
                Thông báo
              </span>
              <Toggle
                label="Chưa đọc"
                checked={unreadOnly}
                onChange={setUnreadOnly}
              />
            </div>

            {list.length === 0 ? (
              <div className="py-10 text-center text-para-m-regular text-text-placeholder">
                Chưa có thông báo
              </div>
            ) : (
              <ul className="space-y-2">
                {list.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => !n.is_read && void markOneRead(n.id)}
                    className={`relative rounded-2xl p-4 cursor-pointer transition-colors ${
                      n.is_read
                        ? "bg-white hover:bg-grey-hover"
                        : "bg-main-light hover:bg-main-light"
                    }`}
                  >
                    {!n.is_read && (
                      <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                    <div className="flex items-center gap-2 flex-wrap pr-5">
                      <p className="text-para-m-semibold text-text-main">
                        {n.title}
                      </p>
                      {n.form_type && (
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-light text-primary text-para-s-medium shrink-0">
                          {n.form_type}
                        </span>
                      )}
                    </div>
                    {n.body && (
                      <p className="text-para-m-regular text-text-secondary mt-2 break-words">
                        {n.body}
                      </p>
                    )}
                    <p className="text-para-s-regular text-text-placeholder mt-3">
                      {formatDateTime(n.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}
