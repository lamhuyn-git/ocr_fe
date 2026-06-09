import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { AuthState, AuthUser, AuthTokens } from "../features/auth/types";
import { tokenManager } from "../lib/token-manager";
import {
  revokeSession,
  restoreSession,
} from "../features/auth/services/auth-api";

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: AuthUser; tokens: AuthTokens } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "BOOTSTRAP_DONE" } // kết thúc khôi phục phiên, ở trạng thái chưa login
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true, // bắt đầu ở trạng thái "chưa biết", chờ restore
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isInitializing: false,
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "BOOTSTRAP_DONE":
      return { ...state, isInitializing: false };
    case "LOGOUT":
      return { ...initialState, isInitializing: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

type AuthContextValue = AuthState & {
  dispatch: React.Dispatch<AuthAction>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const didInit = useRef(false);

  // Khôi phục phiên khi reload: nếu còn refresh token thì refresh + lấy lại user.
  // useRef guard để không chạy 2 lần dưới StrictMode (tránh refresh token bị
  // xoay vòng 2 lần gây lỗi).
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const rt = tokenManager.getRefreshToken();
    if (!rt) {
      dispatch({ type: "BOOTSTRAP_DONE" });
      return;
    }

    restoreSession(rt)
      .then((res) => {
        tokenManager.setTokens(res.tokens.accessToken, res.tokens.refreshToken);
        dispatch({ type: "LOGIN_SUCCESS", payload: res });
      })
      .catch(() => {
        tokenManager.clearTokens();
        dispatch({ type: "BOOTSTRAP_DONE" });
      });
  }, []);

  const signOut = useCallback(async () => {
    const rt = tokenManager.getRefreshToken();
    try {
      if (rt) await revokeSession(rt);
    } finally {
      tokenManager.clearTokens();
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
