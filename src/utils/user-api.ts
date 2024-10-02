import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "./axiosInstance";
import { axiosError } from "@/types/axiosTypes";
type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};
type UpdatePermissionResponse = {
  statusCode: number;
  data: {
    _id: string | null;
    username: string | null;
    email: string | null;
    createdAt: string | null;
    role: string;
    permissions: { _id: string; name: string; resource: string }[];
    updatedAt: string | null;
  };
  message: string;
  success: boolean;
};

type UpdatePermissionRequest = {
  adminId: string;
  permissionList: {
    permissionIds: string[];
  };
};
export const useUpdatePermission = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: UpdatePermissionResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["user", "update_permission"],
    mutationFn: (
      data: UpdatePermissionRequest
    ): Promise<UpdatePermissionResponse> => {
      return axiosInstance.put(
        `/admin/update/user/${data.adminId}`,
        data.permissionList
      );
    },
    onError,
    onSuccess,
  });
interface User {
  _id: string | null;
  username: string | null;
  email: string | null;
  createdAt: string | null;
  totalBots: number | null;
  lastTrainBot: number | null;
}

interface SubAdmin {
  _id: string | null;
  username: string | null;
  email: string | null;
  createdAt: string | null;
  permissions: { _id: string; name: string; resource: string }[];
}

interface FetchUserResponse {
  statusCode: number;
  data: User[] | [];
  message: string;
  success: boolean;
}

interface FetchSubAdminResponse {
  statusCode: number;
  data: SubAdmin[] | [];
  message: string;
  success: boolean;
}
type deleteUserRequest = {
  id: string;
  userType: string;
};
export const useDeleteUser = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: FetchSubAdminResponse | FetchUserResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["user", "delete"],
    mutationFn: (
      data: deleteUserRequest
    ): Promise<FetchSubAdminResponse | FetchUserResponse> => {
      return axiosInstance.delete(`/admin/delete/user/${data.id}`, {
        data: {
          userType: data.userType,
        },
      });
    },
    onError,
    onSuccess,
  });

// interface addUserResponse {
//   username: string;
//   email: string;
//   password: string;
//   role: string;
//   permissionIds: string[];
// }
type addUserRequest = {
  username: string;
  email: string;
  password: string;
  role: string;
  permissionIds: string[];
};
export const useAddUser = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["user", "add"],
    mutationFn: (data: addUserRequest): Promise<DefaultResponse> => {
      return axiosInstance.post(`/admin/create/user`, data);
    },
    onError,
    onSuccess,
  });
