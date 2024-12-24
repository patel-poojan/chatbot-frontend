import { axiosError } from '@/types/axiosTypes';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';

type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};

type GetBotResponseRequest = {
  chatbotId: string;
  type: string;
  buttonId?: string;
  userMessage?: string;
};
export const useGetChatbotResponse = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ['get', 'bot', 'response'],
    mutationFn: (data: GetBotResponseRequest): Promise<DefaultResponse> => {
      return axiosInstance.post(`/chatbot-interact`, data);
    },
    onError,
    onSuccess,
  });
