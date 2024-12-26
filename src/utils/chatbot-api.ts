import { axiosError } from '@/types/axiosTypes';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
import { TypeBotResponse } from '@/types/node';

type GetBotResponseRequest = {
  chatbotId: string;
  type: string;
  buttonId?: string;
  userMessage?: string;
};
type GetBotResponse = {
  response: TypeBotResponse[];
  message: 'Fallback response';
};
export const useGetChatbotResponse = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: GetBotResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ['get', 'bot', 'response'],
    mutationFn: (data: GetBotResponseRequest): Promise<GetBotResponse> => {
      return axiosInstance.post(`/chatbot-interact`, data);
    },
    onError,
    onSuccess,
  });
