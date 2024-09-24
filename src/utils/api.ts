import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { axiosError } from "@/types/axiosTypes";

type LoginResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

type LoginRequest = {
  email: string;
  password: string;
};
// export const useLogin = ({
//   onSuccess,
//   onError,
// }: {
//   onSuccess: (data: LoginResponse) => void;
//   onError: (error: AxiosError) => void;
// }) =>
//   useMutation({
//     mutationKey: ["auth", "login"],
//     mutationFn: (data: LoginRequest): Promise<LoginResponse> => {
//       const payload: LoginRequest = { ...data };
//       return axiosInstance.post("/auth/login", payload);
//     },
//     onError: async(error: AxiosError) => {

//         try {
//         console.log(data);
//         onSuccess(data);
//       } catch (error) {
//         console.log(error);
//       }
//       // Call the provided onError callback
//       onError(error);

//       // Prevent default behavior if it's causing a refresh
//       if (error.response && error.response instanceof Event) {
//         (error.response as Event).preventDefault();
//       }
//     },
//     onSuccess: async (data) => {
//       try {
//         console.log(data);
//         onSuccess(data);
//       } catch (error) {
//         console.log(error);
//       }
//     },
//   });
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
