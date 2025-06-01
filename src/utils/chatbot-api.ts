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
  history: IBotHistory[];
};

export interface IBotHistory {
  question: string;
  answer: string;
}

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
    mutationFn: async (
      data: GetBotResponseRequest
    ): Promise<GetBotResponse> => {
      const res: GetBotResponse = await axiosInstance.post(
        `/chatbot-interact`,
        data,
        {
          headers: {
            'x-playground': 'true',
          },
        }
      );
      // check if response type is llm then store in localstorage
      if (res.response.some((item) => item.type === 'llm')) {
        const history = JSON.parse(
          localStorage.getItem(`${data.chatbotId}-history`) || '[]'
        ) as IBotHistory[];
        res.response.forEach((item) => {
          if (item.type === 'llm' && item.info) {
            history.push({
              question: data.userMessage || '',
              answer: item.info.description || '',
            });
          }
        });
        localStorage.setItem(
          `${data.chatbotId}-history`,
          JSON.stringify(history)
        );
      }
      // Store complete chat history with both user input and bot responses
      const existingChatHistory = localStorage.getItem(
        `${data.chatbotId}-chat-history`
      );
      let chatHistory: TypeBotResponse[] = [];

      try {
        const parsed = JSON.parse(existingChatHistory || '[]');
        chatHistory = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        chatHistory = [];
      }

      // Add user message first (if it exists)
      if (data.userMessage) {
        chatHistory.push({
          type: 'user',
          userInput: data.userMessage,
          delay: 0,
        });
      }

      // Add all bot responses
      res.response.forEach((item) => {
        chatHistory.push({
          ...item,
          delay: item.delay || 0,
        });
      });

      localStorage.setItem(
        `${data.chatbotId}-chat-history`,
        JSON.stringify(chatHistory)
      );
      return res;
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
