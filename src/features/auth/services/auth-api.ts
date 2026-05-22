import type {
  AccountCredentials,
  VneidCredentials,
  AuthTokens,
  AuthUser,
  ApiError,
} from "../types";

export type LoginResponse = {
  tokens: AuthTokens;
  user: AuthUser;
};

const delay = (ms = 800) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function mockTokens(prefix: string): AuthTokens {
  return {
    accessToken: `mock-access-${prefix}-${Date.now()}`,
    refreshToken: `mock-refresh-${prefix}-${Date.now()}`,
    expiresIn: 900, // 15 minutes
  };
}

// MOCK — replace body with real fetch/axios call when backend is ready
export async function loginWithAccount(
  credentials: AccountCredentials,
): Promise<LoginResponse> {
  await delay();

  if (
    credentials.username !== "trulem" ||
    credentials.password !== "password"
  ) {
    throw {
      code: "INVALID_CREDENTIALS",
      message: "Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại.",
    } satisfies ApiError;
  }

  return {
    tokens: mockTokens("account"),
    user: { id: "u-001", name: "Nguyễn Văn A", role: "officer" },
  };
}

// MOCK — replace body with real fetch/axios call when backend is ready
export async function loginWithVneid(
  credentials: VneidCredentials,
): Promise<LoginResponse> {
  await delay();

  if (
    credentials.username !== "123456789" ||
    credentials.password !== "password"
  ) {
    throw {
      code: "INVALID_CREDENTIALS",
      message: "Thông tin đăng nhập không đúng. Vui lòng kiểm tra lại.",
    } satisfies ApiError;
  }

  return {
    tokens: mockTokens("vneid"),
    user: {
      id: "u-002",
      name: "Trần Thị B",
      role: credentials.method === "citizen-vneid" ? "citizen" : "officer",
    },
  };
}

// MOCK — replace body with real fetch/axios call when backend is ready
export async function refreshAccessToken(
  refreshToken: string,
): Promise<AuthTokens> {
  await delay(200);

  if (!refreshToken.startsWith("mock-refresh")) {
    throw {
      code: "TOKEN_EXPIRED",
      message: "Phiên đăng nhập đã hết hạn.",
    } satisfies ApiError;
  }

  return {
    accessToken: `mock-access-refreshed-${Date.now()}`,
    refreshToken, // real impl should rotate this
    expiresIn: 900,
  };
}

// MOCK — replace body with real fetch/axios call when backend is ready
export async function revokeSession(_refreshToken: string): Promise<void> {
  await delay(150);
  // server invalidates the refresh token server-side
}
