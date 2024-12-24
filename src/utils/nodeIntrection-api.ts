import { axiosError } from '@/types/axiosTypes';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
import { TypeNodeInfo } from '@/types/node';
type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};
type NodeResponse = {
  statusCode: number;
  data: {
    _id: string;
    chatbotId: string;
    createdAt: string;
    updatedAt: string;
    node: TypeNodeInfo;
  };
  success: boolean;
  message: string;
  utterances?: string[] | [];
};
type GetNodeInformation = {
  nodeId: string;
  chatbotId: string;
};
export const useGetNodeInformation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: NodeResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ['node', 'information', 'get'],
    mutationFn: (data: GetNodeInformation): Promise<NodeResponse> => {
      return axiosInstance.get(
        `/playground/${data.chatbotId}/node/${data.nodeId}`
      );
    },
    onError,
    onSuccess,
  });

type UpdateNodeInformation = {
  nodeId: string;
  chatbotId: string;
  data: TypeNodeInfo;
};
export const useUpdateNodeInformation = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ['node', 'information', 'update'],
    mutationFn: (data: UpdateNodeInformation): Promise<DefaultResponse> => {
      return axiosInstance.put(
        `/playground/${data.chatbotId}/node/${data.nodeId}`,
        data.data
      );
    },
    onError,
    onSuccess,
  });
