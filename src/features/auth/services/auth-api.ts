import { apiFetch } from "../../../lib/http-client";
import type {
  AccountLoginRequest,
  VneidLoginRequest,
  AuthTokens,
  AuthUser,
} from "../types";

export type LoginResponse = {
  tokens: AuthTokens;
  user: AuthUser;
};

function toTokens(data: any): AuthTokens {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

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
    ward: data.ward
      ? {
          orgId: data.ward.org_id,
          wardName: data.ward.ward_name,
          provinceId: data.ward.province_id,
          provinceName: data.ward.province_name,
        }
      : undefined,
  };
}

export async function loginWithVneid(
  credentials: VneidLoginRequest,
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
  credentials: AccountLoginRequest,
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

export function loginWithGG() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  window.location.href = `${baseUrl}/api/v1/auth/google/login`;
}

export async function loginWithGoogleTokens(
  accessToken: string,
  refreshToken: string,
): Promise<LoginResponse> {
  const user = await fetchCurrentUser(accessToken);
  return { tokens: { accessToken, refreshToken }, user };
}

export async function forgotPassword(email: string): Promise<void> {
  await apiFetch<{ message: string }>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email: string, otp: string): Promise<void> {
  await apiFetch<{ message: string }>("/api/v1/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
): Promise<void> {
  await apiFetch<{ message: string }>("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, otp, new_password: newPassword }),
  });
}

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

export async function restoreSession(
  refreshToken: string,
): Promise<LoginResponse> {
  const tokens = await refreshAccessToken(refreshToken);
  const user = await fetchCurrentUser(tokens.accessToken);
  return { tokens, user };
}

export async function revokeSession(refreshToken: string): Promise<void> {
  await apiFetch<void>("/api/v1/auth/logout", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}
