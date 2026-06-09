import { apiFetch } from "../../../lib/http-client";
import type {
  AccountCredentials,
  VneidCredentials,
  AuthTokens,
  AuthUser,
  // ApiError,
} from "../types";

export type LoginResponse = {
  tokens: AuthTokens;
  user: AuthUser;
};

// const delay = (ms = 800) =>
//   new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function loginWithVneid(
  credentials: VneidCredentials,
): Promise<LoginResponse> {
  const tokens = await apiFetch<any>("/api/v1/auth/login/citizen", {
    method: "POST",
    body: JSON.stringify({
      national_id: credentials.nationalId,
      password: credentials.password,
    }),
  });
  const data = await apiFetch<any>("/api/v1/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  return {
    tokens: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
    user: {
      id: data.id,
      role: data.role,
      name: data.full_name,
      email: data.email,
    },
  };
}

export async function loginWithAccount(
  credentials: AccountCredentials,
): Promise<LoginResponse> {
  const tokens = await apiFetch<any>("/api/v1/auth/login/staff", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await apiFetch<any>("/api/v1/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });

  return {
    tokens: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
    user: {
      id: data.id,
      role: data.role,
      name: data.full_name,
      email: data.email,
    },
  };
}

// export async function refreshAccessToken(
//   refreshToken: string,
// ): Promise<AuthTokens> {
//   await delay(200);

//   if (!refreshToken.startsWith("mock-refresh")) {
//     throw {
//       code: "TOKEN_EXPIRED",
//       message: "Phiên đăng nhập đã hết hạn.",
//     } satisfies ApiError;
//   }

//   return {
//     accessToken: `mock-access-refreshed-${Date.now()}`,
//     refreshToken,
//     expiresIn: 900,
//   };
// }

// Logout: cần access token (auth) + gửi refresh token trong body để BE thu hồi.
export async function revokeSession(refreshToken: string): Promise<void> {
  await apiFetch<void>("/api/v1/auth/logout", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}
