import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { axiosError } from "@/types/axiosTypes";
import Cookies from "js-cookie";
import { toast } from "sonner";
type DefaultResponse = {
  data: null;
  success: boolean;
  message: string;
};
type LoginResponse = {
  success: boolean;
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

type LoginRequest = {
  email: string;
  password: string;
};
export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: LoginResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (data: LoginRequest): Promise<LoginResponse> => {
      return axiosInstance.post("/auth/login", data);
    },
    onError,
    onSuccess,
  });
export const useLogout = ({
  onSuccess,
}: {
  onSuccess: (data: DefaultResponse) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: (): Promise<DefaultResponse> => {
      return axiosInstance.delete("/auth/logout");
    },
    onSuccess: async (data) => {
      try {
        Cookies.remove("authToken");
        onSuccess(data);
      } catch (error) {
        toast.error(error as string);
      }
    },
  });

type SignupRequest = {
  username: string;
  email: string;
  password: string;
};
export const useSignup = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "signup"],
    mutationFn: (data: SignupRequest): Promise<DefaultResponse> => {
      return axiosInstance.post("/auth/register", data);
    },
    onError,
    onSuccess,
  });

type VerifyResponse = {
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

export const useVerifyEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: VerifyResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "verify-email"],
    mutationFn: (token: string): Promise<VerifyResponse> => {
      return axiosInstance.post(`/auth/verify-email?token=${token}`, {});
    },
    onError,
    onSuccess,
  });

type ResendEmailRequest = {
  email: string;
};

export const useResendEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "resend-email"],
    mutationFn: (data: ResendEmailRequest): Promise<DefaultResponse> => {
      return axiosInstance.post(`/auth/resend-verification-email`, data);
    },
    onError,
    onSuccess,
  });

type ResetPasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export const useResetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "reset-password"],
    mutationFn: (data: ResetPasswordRequest): Promise<DefaultResponse> => {
      return axiosInstance.post(`/auth/change-password`, data);
    },
    onError,
    onSuccess,
  });
