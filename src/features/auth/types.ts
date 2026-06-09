export type LoginMethod = "user-vneid" | "admin-vneid" | "admin-account";
export type LoginStep = 1 | 2;

export type AccountCredentials = {
  email: string;
  password: string;
};

export type VneidCredentials = {
  nationalId: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean; // đang khôi phục phiên lúc mới load app
  error: string | null;
};

export type ApiError = {
  code: string;
  message: string;
};
