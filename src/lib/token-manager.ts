// Access token stays in memory only — intentionally lost on page reload.
// This prevents XSS from persisting tokens between sessions.
let _accessToken: string | null = null;

const REFRESH_TOKEN_KEY = "rt";

export const tokenManager = {
  setTokens(accessToken: string, refreshToken: string): void {
    _accessToken = accessToken;
    // TODO: move refresh token to httpOnly cookie once backend supports Set-Cookie
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getAccessToken(): string | null {
    return _accessToken;
  },

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  clearTokens(): void {
    _accessToken = null;
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  hasSession(): boolean {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY) !== null;
  },
};
