import { useCallback } from "react";
import { useAuthContext } from "../../../store/auth-store";
import { tokenManager } from "../../../lib/token-manager";
import { loginWithAccount, loginWithVneid, type LoginResponse } from "../services/auth-api";
import type { AccountCredentials, VneidCredentials, ApiError } from "../types";

export function useAuth() {
  const { dispatch, signOut, ...state } = useAuthContext();

  const onSuccess = useCallback(
    (res: LoginResponse) => {
      tokenManager.setTokens(res.tokens.accessToken, res.tokens.refreshToken);
      dispatch({ type: "LOGIN_SUCCESS", payload: res });
    },
    [dispatch]
  );

  const onError = useCallback(
    (err: unknown) => {
      const msg =
        (err as ApiError)?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại.";
      dispatch({ type: "LOGIN_FAILURE", payload: msg });
    },
    [dispatch]
  );

  const signInWithAccount = useCallback(
    async (credentials: AccountCredentials): Promise<string | null> => {
      dispatch({ type: "LOGIN_START" });
      try {
        onSuccess(await loginWithAccount(credentials));
        return null;
      } catch (err) {
        onError(err);
        return (err as ApiError)?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại.";
      }
    },
    [dispatch, onSuccess, onError]
  );

  const signInWithVneid = useCallback(
    async (credentials: VneidCredentials): Promise<string | null> => {
      dispatch({ type: "LOGIN_START" });
      try {
        onSuccess(await loginWithVneid(credentials));
        return null;
      } catch (err) {
        onError(err);
        return (err as ApiError)?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại.";
      }
    },
    [dispatch, onSuccess, onError]
  );

  const clearError = useCallback(
    () => dispatch({ type: "CLEAR_ERROR" }),
    [dispatch]
  );

  return { ...state, signInWithAccount, signInWithVneid, signOut, clearError };
}
