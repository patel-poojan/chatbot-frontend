import { axiosError } from "@/types/axiosTypes";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "./axiosInstance";
type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};
type FetchPlaygroundResponse = {
  statusCode: number;
  data: {
    _id: string;
    chatbotId: string;
    createdAt: string;
    updatedAt: string;
    diagram: {
      nodes: {
        id: string;
        type: string;
        data: { label: string; message: string; isDelete: boolean };
        position: { x: number; y: number };
      }[];
      edges: {
        id: string;
        source: string;
        target: string;
        type: string;
      }[];
    };
  };
  message: string;
  success: boolean;
};
type AddNodeRequest = {
  chatbotId: string;
  parentNodeId: string;
  details: {
    type: string;
    nodeData: {
      message: string;
      position: { x: number; y: number };
    };
  };
};
export const useAddNode = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: FetchPlaygroundResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["add", "node"],
    mutationFn: (data: AddNodeRequest): Promise<FetchPlaygroundResponse> => {
      return axiosInstance.post(
        `/playground/${data.chatbotId}/node/${data.parentNodeId}`,
        data.details
      );
    },
    onError,
    onSuccess,
  });

type DeleteNodeRequest = {
  chatbotId: string;
  parentNodeId: string;
  currentNodeId: string;
  isSingleNode: boolean;
};
export const useDeleteNode = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["node", "delete"],
    mutationFn: (data: DeleteNodeRequest): Promise<DefaultResponse> =>
      axiosInstance.delete(
        `/playground/${data.chatbotId}/parentnode/${data.parentNodeId}/node/${data.currentNodeId}?isSingleNode=${data.isSingleNode}`
      ),
    onSuccess,
    onError,
  });
