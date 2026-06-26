export type LoginMethod = "user-vneid" | "admin-vneid" | "admin-account";
export type LoginStep = 1 | 2;

// Loại tài khoản suy ra từ endpoint login đã dùng (không phụ thuộc role của BE).
export type AccountType = "citizen" | "staff";

// Request gửi lên /api/v1/auth/login/staff
export type AccountLoginRequest = {
  email: string;
  password: string;
};

// Request gửi lên /api/v1/auth/login/citizen
export type VneidLoginRequest = {
  nationalId: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// Phường officer phụ trách — chỉ có khi tài khoản là cán bộ phường (ward_officer).
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
  // ward_admin: cán bộ cấp phường/xã — bị khoá bộ lọc địa bàn (tỉnh/phường).
  role: "user" | "admin" | "ward_admin";
  // Set khi user là cán bộ phường; dùng để prefill + khoá field địa bàn trên form.
  ward?: WardAssignment;
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
