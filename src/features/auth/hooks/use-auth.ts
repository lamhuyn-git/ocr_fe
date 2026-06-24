import { useCallback } from "react";
import { useAuthContext } from "../../../store/auth-store";
import { tokenManager } from "../../../lib/token-manager";
import {
  loginWithAccount,
  loginWithVneid,
  loginWithGoogleTokens,
  type LoginResponse,
} from "../services/auth-api";
import type {
  AccountLoginRequest,
  VneidLoginRequest,
  AccountType,
  ApiError,
} from "../types";

export function useAuth() {
  const { dispatch, signOut, ...state } = useAuthContext();

  const onSuccess = useCallback(
    (res: LoginResponse, accountType: AccountType) => {
      tokenManager.setTokens(res.tokens.accessToken, res.tokens.refreshToken);
      tokenManager.setAccountType(accountType);
      dispatch({ type: "LOGIN_SUCCESS", payload: { ...res, accountType } });
    },
    [dispatch],
  );

  const onError = useCallback(
    (err: unknown) => {
      const msg =
        (err as ApiError)?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại.";
      dispatch({ type: "LOGIN_FAILURE", payload: msg });
    },
    [dispatch],
  );

  const signInWithAccount = useCallback(
    async (credentials: AccountLoginRequest): Promise<string | null> => {
      dispatch({ type: "LOGIN_START" });
      try {
        onSuccess(await loginWithAccount(credentials), "staff");
        return null;
      } catch (err) {
        onError(err);
        return (
          (err as ApiError)?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại."
        );
      }
    },
    [dispatch, onSuccess, onError],
  );

  const signInWithVneid = useCallback(
    async (credentials: VneidLoginRequest): Promise<string | null> => {
      dispatch({ type: "LOGIN_START" });
      try {
        onSuccess(await loginWithVneid(credentials), "citizen");
        return null;
      } catch (err) {
        onError(err);
        return (
          (err as ApiError)?.message ?? "Đã có lỗi xảy ra, vui lòng thử lại."
        );
      }
    },
    [dispatch, onSuccess, onError],
  );

  // Hoàn tất đăng nhập Google (chỉ dành cho công dân — theo ràng buộc backend).
  const completeGoogleLogin = useCallback(
    async (accessToken: string, refreshToken: string): Promise<boolean> => {
      dispatch({ type: "LOGIN_START" });
      try {
        onSuccess(await loginWithGoogleTokens(accessToken, refreshToken), "citizen");
        return true;
      } catch (err) {
        onError(err);
        return false;
      }
    },
    [dispatch, onSuccess, onError],
  );

  const clearError = useCallback(
    () => dispatch({ type: "CLEAR_ERROR" }),
    [dispatch],
  );

  return {
    ...state,
    signInWithAccount,
    signInWithVneid,
    completeGoogleLogin,
    signOut,
    clearError,
  };
}
