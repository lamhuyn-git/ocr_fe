import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuthContext } from "../../store/auth-store";
import { useToast } from "../../store/toast-store";
import { tokenManager } from "../../lib/token-manager";
import type { NotificationItem } from "./types";
import {
  fetchNotifications,
  markNotificationsRead,
} from "./services/notifications-api";

type NotificationContextValue = {
  items: NotificationItem[];
  unread: number;
  eventSeq: number; // tăng mỗi khi nhận 1 thông báo mới qua WS — để nơi khác refetch
  markAllRead: () => Promise<void>;
  markOneRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function buildWsUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL ?? "";
  const wsBase = base.replace(/^http/, "ws");
  return `${wsBase}/api/v1/ws/notifications`;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const { showToast } = useToast();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [eventSeq, setEventSeq] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetchNotifications(1, 20);
      setItems(res.items);
      setUnread(res.unread);
    } catch {
      /* bỏ qua lỗi tải */
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await markNotificationsRead({ all: true });
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {
      /* bỏ qua */
    }
  }, []);

  const markOneRead = useCallback(async (id: string) => {
    try {
      await markNotificationsRead({ ids: [id] });
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnread((u) => Math.max(0, u - 1));
    } catch {
      /* bỏ qua */
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      wsRef.current?.close();
      wsRef.current = null;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      setItems([]);
      setUnread(0);
      return;
    }

    let stopped = false;
    void refresh();

    function connect() {
      const token = tokenManager.getAccessToken();
      if (!token || stopped) return;

      const ws = new WebSocket(buildWsUrl());
      wsRef.current = ws;

      ws.onopen = () => ws.send(JSON.stringify({ token }));

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.event === "notification" && msg.data) {
            const n = msg.data as NotificationItem;
            setItems((prev) => [n, ...prev]);
            setUnread((u) => u + 1);
            setEventSeq((s) => s + 1);
            showToast(n.title, n.body ?? "");
          }
        } catch {
          /* tin không phải JSON hợp lệ */
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (stopped) return;
        reconnectRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      stopped = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [isAuthenticated, refresh, showToast]);

  return (
    <NotificationContext.Provider
      value={{ items, unread, eventSeq, markAllRead, markOneRead, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
