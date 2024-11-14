import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "./axiosInstance";
import { axiosError } from "@/types/axiosTypes";

// Default response type for general API responses
type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};

// Response type for updating permissions
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

// Request type for updating permissions
type UpdatePermissionRequest = {
  adminId: string;
  permissionList: {
    permissionIds: string[];
  };
};

// Request type for deleting a user
type DeleteUserRequest = {
  id: string;
  userType: string;
};

// Request type for adding a user
type AddUserRequest = {
  username: string;
  email: string;
  password: string;
  role: string;
  permissionIds: string[];
};

// Response type for fetching user data
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

// Generic utility hook for admin-related mutations
const useAdminMutation = <TData, TVariables>({
  mutationKey,
  mutationFn,
  onSuccess,
  onError,
}: {
  mutationKey: string[];
  mutationFn: (data: TVariables) => Promise<TData>;
  onSuccess: (data: TData) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation<TData, axiosError, TVariables>({
    mutationKey,
    mutationFn,
    onError,
    onSuccess,
  });

// Hook for updating permissions
export const useUpdatePermission = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: UpdatePermissionResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useAdminMutation<UpdatePermissionResponse, UpdatePermissionRequest>({
    mutationKey: ["admin", "user", "update_permission"],
    mutationFn: (data: UpdatePermissionRequest) =>
      axiosInstance.put(
        `/admin/update/user/${data.adminId}`,
        data.permissionList
      ),
    onSuccess,
    onError,
  });

// Hook for deleting a user
export const useDeleteUser = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: FetchSubAdminResponse | FetchUserResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useAdminMutation<
    FetchSubAdminResponse | FetchUserResponse,
    DeleteUserRequest
  >({
    mutationKey: ["admin", "user", "delete"],
    mutationFn: (data: DeleteUserRequest) =>
      axiosInstance.delete(`/admin/delete/user/${data.id}`, {
        data: {
          userType: data.userType,
        },
      }),
    onSuccess,
    onError,
  });

// Hook for adding a new user
export const useAddUser = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useAdminMutation<DefaultResponse, AddUserRequest>({
    mutationKey: ["admin", "user", "add"],
    mutationFn: (data: AddUserRequest) =>
      axiosInstance.post(`/admin/create/user`, data),
    onSuccess,
    onError,
  });
