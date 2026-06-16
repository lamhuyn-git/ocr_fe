import { tokenManager } from "./token-manager";
import type { ApiError } from "../features/auth/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type RequestOptions = RequestInit & { auth?: boolean }; // auth=true thì gắn Bearer token

export async function apiFetch<T>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, ...rest } = opts;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };
  if (auth) {
    const token = tokenManager.getAccessToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (!res.ok) {
    let body: any = null;
    try {
      body = await res.json();
    } catch {
      /* body rỗng */
    }

    const detail = body?.detail;
    let message = "Đã có lỗi xảy ra, vui lòng thử lại.";

    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail) && detail[0]?.msg) {
      message = detail[0].msg;
    } else if (typeof body?.error === "string") {
      // slowapi (rate limit) trả {"error": "..."} thay vì {"detail": ...}.
      message = body.error;
    }

    // Quá nhiều lần thử — thông báo thân thiện thay cho text kỹ thuật.
    if (res.status === 429) {
      message = "Bạn đã thử quá nhiều lần. Vui lòng thử lại sau ít phút.";
    }

    throw {
      code: `HTTP_${res.status}`,
      message,
    } satisfies ApiError;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
