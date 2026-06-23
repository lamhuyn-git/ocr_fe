export type LoginMethod = "user-vneid" | "admin-vneid" | "admin-account";
export type LoginStep = 1 | 2;

// Loại tài khoản suy ra từ endpoint login đã dùng (không phụ thuộc role của BE).
export type AccountType = "citizen" | "staff";

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
  // ward_admin: cán bộ cấp phường/xã — bị khoá bộ lọc địa bàn (tỉnh/phường).
  role: "user" | "admin" | "ward_admin";
};

export type AuthState = {
  user: AuthUser | null;
  accountType: AccountType | null; // citizen | staff — quyết định trang đích
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean; // đang khôi phục phiên lúc mới load app
  error: string | null;
};

export type ApiError = {
  code: string;
  message: string;
};
