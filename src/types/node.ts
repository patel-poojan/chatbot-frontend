export interface ResponseInfo {
  file?: string;
  title?: string;
  description?: string;
  button?: {
    id: string;
    title: string;
    type: string;
    message?: string;
    url?: string;
    phoneNumber?: string;
    goto?: string;
  }[];
}

export interface TypeResponseList {
  type: 'text' | 'image' | 'button' | 'quick' | 'gallery';
  delay: number;
  info: ResponseInfo;
}
export interface TypeNodeInfo {
  id: string;
  type: string;
  data: {
    message: string;
  };
  position: {
    x: number;
    y: number;
  };
  response:
    | TypeResponseList[]
    | { question: string; answer: string; delay?: number }[]
    | [];
  utterances?: string[] | [];
}
export interface TypeBotResponse {
  delay: number;
  title?: string;
  type: string;
  filters?: [];
  matchAll?: boolean;
  buttons?:
    | {
        id: string;
        title: string;
        type: string;
        message?: string;
        url?: string;
        phoneNumber?: string;
        goto?: string;
      }[]
    | [];
  info?: ResponseInfo;
  userInput?: string;
}
