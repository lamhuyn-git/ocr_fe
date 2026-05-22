import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthState, AuthUser, AuthTokens } from "../features/auth/types";
import { tokenManager } from "../lib/token-manager";
import { revokeSession } from "../features/auth/services/auth-api";

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: AuthUser; tokens: AuthTokens } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
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
        user: action.payload.user,
        isAuthenticated: true,
        error: null,
      };
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "LOGOUT":
      return { ...initialState };
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

  // TODO: on mount, if tokenManager.hasSession(), call refreshAccessToken to
  // restore the user session silently. Needs backend to return user info from
  // the refresh endpoint before this can be implemented properly.

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
