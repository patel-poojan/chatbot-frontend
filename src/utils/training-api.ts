import { axiosError } from '@/types/axiosTypes';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
import { TypeResponseList } from '@/types/node';

type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};
type TrainDeleteRequest = {
  chatbotId: string;
  phareseId: string;
  details: {
    type: 'ignored' | 'trained' | 'delete';
    response: TypeResponseList[] | [];
  };
};
export const useTrainDeleteData = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ['add', 'attributes'],
    mutationFn: (data: TrainDeleteRequest): Promise<DefaultResponse> => {
      return axiosInstance.post(
        `/chatbot/${data.chatbotId}/unmatchedPhrases/${data.phareseId}`,
        data.details
      );
    },
    onError,
    onSuccess,
  });
