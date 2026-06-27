import { apiFetch } from "../../../lib/http-client";
import type { NotificationListResponse } from "../types";

export async function fetchNotifications(
  page = 1,
  pageSize = 20,
): Promise<NotificationListResponse> {
  return apiFetch<NotificationListResponse>(
    `/api/v1/notifications?page=${page}&page_size=${pageSize}`,
    { auth: true },
  );
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await apiFetch<{ unread: number }>(
    `/api/v1/notifications/unread-count`,
    { auth: true },
  );
  return res.unread;
}

export async function markNotificationsRead(payload: {
  ids?: string[];
  all?: boolean;
}): Promise<number> {
  const res = await apiFetch<{ updated: number }>(
    `/api/v1/notifications/mark-read`,
    { method: "POST", auth: true, body: JSON.stringify(payload) },
  );
  return res.updated;
}
