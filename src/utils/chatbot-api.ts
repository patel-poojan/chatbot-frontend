import { axiosError } from '@/types/axiosTypes';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from './axiosInstance';
import { TypeBotResponse } from '@/types/node';
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
  model: string;
};
type GetBotResponse = {
  closeChat?: 'END' | 'START' | 'END';
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
      return axiosInstance.post(`/chatbot-interact`, data, {
        headers: {
          'x-playground': 'true',
        },
      });
    },
    onError,
    onSuccess,
  });
type saveContactRequest = {
  chatbotId: string;
  name: string;
  number: string;
  email: string;
};

export const useSaveContact = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ['save', 'contact'],
    mutationFn: (data: saveContactRequest): Promise<DefaultResponse> => {
      return axiosInstance.post(`chatbot-interact/contact`, data, {
        headers: {
          'x-playground': 'true',
        },
      });
    },
    onError,
    onSuccess,
  });
