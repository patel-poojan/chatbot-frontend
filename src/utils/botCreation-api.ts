import { axiosError } from "@/types/axiosTypes";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "./axiosInstance";

type DefaultResponse = {
  statusCode: number;
  data: null;
  success: boolean;
  message: string;
};
type CreateChatbotRequest = {
  type: string;
};
type CreateChatbotResponse = {
  statusCode: number;
  data: {
    type: string;
    createdBy: string;
    isActive: boolean;
    version: number;
    language: string;
    analyticsEnabled: boolean;
    customizations: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      logo: {
        url: string;
        localPath: string;
      };
    };
    _id: string;
    attributes: [];
    configuredButtons: {
      type: string;
      label: string;
      isEnabled: boolean;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message: string;
  success: boolean;
};
export const useCreateChatbot = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: CreateChatbotResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["create", "chatbot"],
    mutationFn: (data: CreateChatbotRequest): Promise<CreateChatbotResponse> => {
      return axiosInstance.post(`/chatbot`, data);
    },
    onError,
    onSuccess,
  });

type SaveBDAQuestionRequest = {
  chatbotId: string;
  category: string;
  subcategory: string;
  data: {
    question: string;
    answer: string;
  }[];
};

type SaveBDAQuestionResponse = {
  statusCode: number;
  data: {
    message: string;
    id: string;
  };
  message: string;
  success: boolean;
};

export const useSaveBDAQuestion = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: SaveBDAQuestionResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["save", "BDA"],
    mutationFn: (data: SaveBDAQuestionRequest): Promise<SaveBDAQuestionResponse> => {
      return axiosInstance.post(
        `/bda/submit-question-data
`,
        data
      );
    },
    onError,
    onSuccess,
  });

type TrainBotRequest = {
  chatbotId: string;
  details: {
    document?: File[];
    type: string;
    websiteUrl?: string;
    scanType?: string;
    urls_to_scrape?: string[];
  };
};

type trainBotResponse = {
  statusCode: number;
  data: {
    chatbotId: string;
    websiteContent: {
      url: string[];
      domain: string;
      websiteContentUrl: {
        url: string;
        localPath: string;
      };
    };
    isProcessed: boolean;
    processingErrors: [];
    _id: string;
    documentContent: [];
    lastSyncedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  };
  message: string;
  success: boolean;
};
const createFormData = (details: TrainBotRequest["details"]) => {
  const formData = new FormData();

  if (details.document) {
    details.document.forEach((file) => {
      formData.append(`document`, file);
    });
  }

  formData.append("type", details.type);
  if (details.websiteUrl) formData.append("websiteUrl", details.websiteUrl);
  if (details.scanType) formData.append("scanType", details.scanType);
  if (details.urls_to_scrape) formData.append("urls_to_scrape", JSON.stringify(details.urls_to_scrape));

  return formData;
};
export const useTrainBot = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: trainBotResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["train", "Bot"],
    mutationFn: (data: TrainBotRequest): Promise<trainBotResponse> => {
      const formData = createFormData(data.details);
      return axiosInstance.post(`/chatbot/${data.chatbotId}/chatbotDoc`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError,
    onSuccess,
  });

type DeleteBotRequest = {
  chatbotId: string;
};
export const useDeleteBot = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: CreateChatbotResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["delete", "bot"],
    mutationFn: (data: DeleteBotRequest): Promise<CreateChatbotResponse> =>
      axiosInstance.delete(`/chatbot/${data.chatbotId}`),
    onSuccess,
    onError,
  });

type UpdateChatbotRequest = {
  chatbotId: string;
  details: {
    name?: string;
    aboutAs?: string;
    domainName?: string;
    welcomeMessage?: string;
    isActive?: boolean;
    version?: number;
    language?: string;
    analyticsEnabled?: boolean;
    configuredButtons?: {
      type: string;
      isEnabled: boolean;
    }[];
    customizations?: {
      fontFamily?: string;
      logo?: {
        url: string;
        localPath: string;
      };
    };
  };
};
export const useUpdateChatbot = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["update", "bot"],
    mutationFn: (data: UpdateChatbotRequest): Promise<DefaultResponse> =>
      axiosInstance.put(`/chatbot/${data.chatbotId}`, data.details),
    onSuccess,
    onError,
  });

type SetupPlaygroundRequest = {
  chatbotId: string;
  details: {
    welcome: string;
    replies: {
      name: string;
      enabled: boolean;
      position: { x: number; y: number };
    }[];
  };
};
export const useSetupPlayground = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: DefaultResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["setup", "playground"],
    mutationFn: (data: SetupPlaygroundRequest): Promise<DefaultResponse> => {
      return axiosInstance.post(`/playground/setup/${data.chatbotId}`, data.details);
    },
    onError,
    onSuccess,
  });

type fetchURLRequest = {
  websiteUrl: string;
  scanType: string;
};
type fetchURLResponse = {
  statusCode: number;
  data: {
    domain: string;
    urls: string[];
  };
  message: string;
  success: boolean;
};
export const useFetchURLForTraining = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: fetchURLResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["fetch", "urls", "training"],
    mutationFn: (data: fetchURLRequest): Promise<fetchURLResponse> => {
      return axiosInstance.post(`/chatbot/getURLs`, data);
    },
    onError,
    onSuccess,
  });
