import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "./axiosInstance";
import { axiosError } from "@/types/axiosTypes";
import Cookies from "js-cookie";
import { toast } from "sonner";

// Common types
type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};

type LoginResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
};

// Request Types
type LoginRequest = {
  email: string;
  password: string;
};

type SignupRequest = {
  username: string;
  email: string;
  password: string;
};

type VerifyResponse = {
  statusCode: number;
  data: {
    accessToken: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
  success: boolean;
  message: string;
};

type ResendEmailRequest = {
  email: string;
};

type ResetPasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

type ForgetPasswordRequest = {
  email: string;
};

type ForgetPasswordResetRequest = {
  newPassword: string;
  token: string;
};

// Helper for centralized error handling
const handleError = (error: axiosError) => {
  toast.error(error.response?.data?.message || "An error occurred");
};

// Generic hook factory for auth mutations
const useAuthMutation = <TData, TVariables>(
  mutationKey: string[],
  mutationFn: (variables: TVariables) => Promise<TData>,
  onSuccess: (data: TData) => void,
  onError?: (error: axiosError) => void
) => {
  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess,
    onError: onError || handleError,
  });
};

// Login Mutation
export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: LoginResponse) => void;
  onError?: (error: axiosError) => void;
}) =>
  useAuthMutation<LoginResponse, LoginRequest>(
    ["auth", "login"],
    (data: LoginRequest) => axiosInstance.post("/auth/login", data),
    onSuccess,
    onError
  );

// Logout Mutation
export const useLogout = ({
  onSuccess,
}: {
  onSuccess: (data: DefaultResponse) => void;
}) =>
  useAuthMutation<DefaultResponse, void>(
    ["auth", "logout"],
    () => axiosInstance.delete("/auth/logout"),
    (data) => {
      Cookies.remove("authToken");
      onSuccess(data);
    }
  );

// Signup Mutation
export const useSignup = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError?: (error: axiosError) => void;
}) =>
  useAuthMutation<DefaultResponse, SignupRequest>(
    ["auth", "signup"],
    (data: SignupRequest) => axiosInstance.post("/auth/register", data),
    onSuccess,
    onError
  );

// Verify Email Mutation
export const useVerifyEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: VerifyResponse) => void;
  onError?: (error: axiosError) => void;
}) =>
  useAuthMutation<VerifyResponse, string>(
    ["auth", "verify-email"],
    (token: string) =>
      axiosInstance.post(`/auth/verify-email?token=${token}`, {}),
    onSuccess,
    onError
  );

// Resend Email Verification
export const useResendEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError?: (error: axiosError) => void;
}) =>
  useAuthMutation<DefaultResponse, ResendEmailRequest>(
    ["auth", "resend-email"],
    (data: ResendEmailRequest) =>
      axiosInstance.post(`/auth/resend-verification-email`, data),
    onSuccess,
    onError
  );

// Reset Password
export const useResetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError?: (error: axiosError) => void;
}) =>
  useAuthMutation<DefaultResponse, ResetPasswordRequest>(
    ["auth", "reset-password"],
    (data: ResetPasswordRequest) =>
      axiosInstance.post(`/auth/change-password`, data),
    onSuccess,
    onError
  );

// Forget Password
export const useForgetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError?: (error: axiosError) => void;
}) =>
  useAuthMutation<DefaultResponse, ForgetPasswordRequest>(
    ["auth", "forget-password"],
    (data: ForgetPasswordRequest) =>
      axiosInstance.post(`/auth/forgot-password`, data),
    onSuccess,
    onError
  );

// Forget Password Reset
export const useForgetPasswordReset = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError?: (error: axiosError) => void;
}) =>
  useAuthMutation<DefaultResponse, ForgetPasswordResetRequest>(
    ["auth", "forget-password-reset"],
    (data: ForgetPasswordResetRequest) =>
      axiosInstance.post(`auth/reset-password?token=${data.token}`, {
        newPassword: data?.newPassword || "",
      }),
    onSuccess,
    onError
  );
