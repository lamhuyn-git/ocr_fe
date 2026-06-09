import { apiFetch } from "../../../lib/http-client";
import type {
  AccountCredentials,
  VneidCredentials,
  AuthTokens,
  AuthUser,
} from "../types";

export type LoginResponse = {
  tokens: AuthTokens;
  user: AuthUser;
};

// BE TokenResponse { access_token, refresh_token, token_type } -> AuthTokens.
// BE không trả thời gian hết hạn nên không lưu expiry.
function toTokens(data: any): AuthTokens {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

// Lấy user hiện tại bằng access token. Dùng chung cho cả login lẫn restore.
// Phải truyền token thủ công vì lúc gọi, token chưa được lưu vào tokenManager.
async function fetchCurrentUser(accessToken: string): Promise<AuthUser> {
  const data = await apiFetch<any>("/api/v1/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return {
    id: data.id,
    role: data.role,
    name: data.full_name,
    email: data.email,
  };
}

export async function loginWithVneid(
  credentials: VneidCredentials,
): Promise<LoginResponse> {
  const tokens = toTokens(
    await apiFetch<any>("/api/v1/auth/login/citizen", {
      method: "POST",
      body: JSON.stringify({
        national_id: credentials.nationalId,
        password: credentials.password,
      }),
    }),
  );
  const user = await fetchCurrentUser(tokens.accessToken);
  return { tokens, user };
}

export async function loginWithAccount(
  credentials: AccountCredentials,
): Promise<LoginResponse> {
  const tokens = toTokens(
    await apiFetch<any>("/api/v1/auth/login/staff", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    }),
  );
  const user = await fetchCurrentUser(tokens.accessToken);
  return { tokens, user };
}

// Đổi refresh token lấy access token mới.
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthTokens> {
  return toTokens(
    await apiFetch<any>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
  );
}

// Khôi phục phiên khi reload: refresh -> lấy lại user.
// Ném lỗi nếu refresh token hết hạn/không hợp lệ; caller tự dọn token.
export async function restoreSession(
  refreshToken: string,
): Promise<LoginResponse> {
  const tokens = await refreshAccessToken(refreshToken);
  const user = await fetchCurrentUser(tokens.accessToken);
  return { tokens, user };
}

// Logout: cần access token (auth) + gửi refresh token trong body để BE thu hồi.
export async function revokeSession(refreshToken: string): Promise<void> {
  await apiFetch<void>("/api/v1/auth/logout", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}
