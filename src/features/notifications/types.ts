export type NotificationType = "form_submitted" | "form_returned";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  form_id: string | null;
  form_type: string | null;
  is_read: boolean;
  channel: string | null;
  created_at: string;
};

export type NotificationListResponse = {
  items: NotificationItem[];
  total: number;
  unread: number;
  page: number;
  page_size: number;
};
