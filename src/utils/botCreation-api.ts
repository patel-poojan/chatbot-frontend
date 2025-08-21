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
    mutationFn: (
      data: CreateChatbotRequest
    ): Promise<CreateChatbotResponse> => {
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
    mutationFn: (
      data: SaveBDAQuestionRequest
    ): Promise<SaveBDAQuestionResponse> => {
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
    document?: string[];
    type: string;
    websiteUrl?: string;
    scanType?: string;
    websiteUrlToScrape?: string[];
    websiteUrlToIgnore?: string[];
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
      // Remove FormData, send as JSON
      return axiosInstance.post(
        `/chatbot/${data.chatbotId}/chatbotDoc`,
        data.details // Send details directly as JSON
        // Remove Content-Type header, let axios set it automatically
      );
    },
    onError,
    onSuccess,
  });
type UpdateTrainBotRequest = {
  chatbotId: string;
  details: {
    document?: string[];
    type?: string;
    websiteUrl?: string;
    scanType?: string;
    websiteUrlToScrape?: string[];
    documentContent?: {
      active: boolean;
      url: string;
      localPath: string;
    }[];
    websiteContent?: {
      active: boolean;
      url: string;
      localPath: string;
    }[];
  };
};

export const useUpdateTrainData = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: trainBotResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["update", "train", "Bot"],
    mutationFn: (data: UpdateTrainBotRequest): Promise<trainBotResponse> => {
      return axiosInstance.put(
        `/chatbot/${data.chatbotId}/chatbotDoc`,
        data.details // Send details directly as JSON
      );
    },
    onError,
    onSuccess,
  });

export const useRecrawlWebsiteData = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: trainBotResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["update", "train", "Bot"],
    mutationFn: (data: UpdateTrainBotRequest): Promise<trainBotResponse> => {
      return axiosInstance.put(
        `/chatbot/${data.chatbotId}/chatbotDoc/recrawl`,
        data.details // Send details directly as JSON
      );
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

// type UpdateChatbotRequest = {
//   chatbotId: string;
//   details: {
//     name?: string;
//     aboutAs?: string;
//     domainName?: string;
//     welcomeMessage?: string;
//     isActive?: boolean;
//     version?: number;
//     language?: string;
//     analyticsEnabled?: boolean;
//     state?: "active" | "draft";
//     configuredButtons?: {
//       type: string;
//       isEnabled: boolean;
//     }[];
//     customizations?: {
//       fontFamily?: string;
//       logo?: {
//         url: string;
//         localPath: string;
//       };
//       closeChat: "END" | "START" | "OFF";
//     };
//   };
// };
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
    state?: "active" | "draft";
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
      closeChat: string; // 'OFF' | 'END' | 'START';
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
type getChatbotRequest = {
  chatbotId: string;
};
type getChatbotResponse = {
  statusCode: number;
  data: {
    customizations: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      logo: {
        url: string;
        localPath: string;
      };
      closeChat: "OFF" | "END" | "START";
    };
    _id: string;
    type: string;
    createdBy: string;
    isActive: boolean;
    version: number;
    language: string;
    analyticsEnabled: boolean;
    configuredButtons: {
      type: string;
      label: string;
      isEnabled: boolean;
    }[];
    state: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    aboutAs: string;
    name: string;
    welcomeMessage: string;
  };
  message: string;
  success: boolean;
};

export const useGetChatbotDetails = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: getChatbotResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["get", "bot"],
    mutationFn: (data: getChatbotRequest): Promise<getChatbotResponse> =>
      axiosInstance.get(`/chatbot/${data.chatbotId}`),
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
      return axiosInstance.post(
        `/playground/setup/${data.chatbotId}`,
        data.details
      );
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
    urls: {
      url: string;
      label: string;
    }[];
  };
  message: string;
  success: boolean;
};

function sortByUrlLevels(jsonArray: fetchURLResponse["data"]["urls"]) {
  return jsonArray.sort((a, b) => {
    const levelA = (a.url.match(/\//g) || []).length;
    const levelB = (b.url.match(/\//g) || []).length;

    // First, sort by the number of slashes (levels)
    if (levelA !== levelB) {
      return levelA - levelB;
    }

    // If levels are the same, sort alphabetically
    return a.url.localeCompare(b.url);
  });
}

export const useFetchURLForTraining = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: fetchURLResponse) => void;
  onError: (error: axiosError) => void;
}) =>
  useMutation({
    mutationKey: ["fetch", "urls", "training"],
    mutationFn: async (data: fetchURLRequest): Promise<fetchURLResponse> => {
      const response: fetchURLResponse = await axiosInstance.post(
        `/chatbot/getURLs`,
        data
      );
      const sortedURLs = sortByUrlLevels(response?.data?.urls);
      response.data.urls = sortedURLs;
      return response;
    },
    onError,
    onSuccess,
  });
