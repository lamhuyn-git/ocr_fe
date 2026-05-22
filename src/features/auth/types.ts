export type LoginMethod = "citizen-vneid" | "officer-vneid" | "officer-account";
export type LoginStep = 1 | 2;

export type AccountCredentials = {
  username: string;
  password: string;
};

export type VneidCredentials = {
  username: string;
  password: string;
  method: "citizen-vneid" | "officer-vneid";
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
};

export type AuthUser = {
  id: string;
  name: string;
  role: "citizen" | "officer";
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type ApiError = {
  code: string;
  message: string;
};
