import { axiosError } from "@/types/axiosTypes";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "./axiosInstance";

// type DefaultResponse = {
//   statusCode: number;
//   data: null;
//   success: boolean;
//   message: string;
// };

type FetchAttributesResponse = {
  statusCode: number;
  data: {
    _id: string;
    chatbotId: string;
    name: string;
    alias: string;
    value: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
  }[];

  message: string;
  success: boolean;
};
type AddAttributesRequest = {
  chatbotId: string;
  details: {
    attributes: {
      name: string;
      alias: string;
      value: string;
    }[];
  };
};
export const useAddAttributes = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: FetchAttributesResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["add", "attributes"],
    mutationFn: (
      data: AddAttributesRequest
    ): Promise<FetchAttributesResponse> => {
      return axiosInstance.post(
        `/chatbot/${data.chatbotId}/attributes`,
        data.details
      );
    },
    onError,
    onSuccess,
  });

type UpdateAttributesRequest = {
  chatbotId: string;
  attributeId: string;
  details: {
    name?: string;
    alias?: string;
    value?: string;
  };
};
export const useUpdateAttributes = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: FetchAttributesResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["update", "attributes"],
    mutationFn: (
      data: UpdateAttributesRequest
    ): Promise<FetchAttributesResponse> => {
      return axiosInstance.put(
        `/chatbot/${data.chatbotId}/attribute/${data.attributeId}`,
        data.details
      );
    },
    onError,
    onSuccess,
  });

type DeleteAttributesRequest = {
  chatbotId: string;
  attributeId: string;
};
export const useDeleteAttribute = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: FetchAttributesResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["delete", "attribute"],
    mutationFn: (
      data: DeleteAttributesRequest
    ): Promise<FetchAttributesResponse> => {
      return axiosInstance.delete(
        `/chatbot/${data.chatbotId}/attribute/${data.attributeId}`
      );
    },
    onError,
    onSuccess,
  });
