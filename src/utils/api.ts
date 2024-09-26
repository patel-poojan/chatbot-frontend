import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { axiosError } from "@/types/axiosTypes";

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
type SignupResponse = {
  data: null;
  success: boolean;
  message: string;
};
type SignupRequest = {
  username: string;
  email: string;
  password: string;
};
export const useSignup = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: SignupResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (data: SignupRequest): Promise<SignupResponse> => {
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
    mutationKey: ["auth", "login"],
    mutationFn: (token: string): Promise<VerifyResponse> => {
      return axiosInstance.post(`/auth/verify-email?token=${token}`, {});
    },
    onError,
    onSuccess,
  });

type ResendEmailRequest = {
  email: string;
};
type ResendEmailResponse = {
  data: null;
  success: boolean;
  message: string;
};

export const useResendEmail = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: ResendEmailResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (data: ResendEmailRequest): Promise<ResendEmailResponse> => {
      return axiosInstance.post(`/auth/resend-verification-email`, data);
    },
    onError,
    onSuccess,
  });
