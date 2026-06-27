export type LoginMethod = "user-vneid" | "admin-vneid" | "admin-account";
export type LoginStep = 1 | 2;

export type AccountType = "citizen" | "staff";

export type AccountLoginRequest = {
  email: string;
  password: string;
};

export type VneidLoginRequest = {
  nationalId: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type WardAssignment = {
  orgId: string;
  wardName: string;
  provinceId: string | null;
  provinceName: string | null;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "ward_admin";
  ward?: WardAssignment;
};

export type AuthState = {
  user: AuthUser | null;
  accountType: AccountType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
};

export type ApiError = {
  code: string;
  message: string;
};
