export interface ResponseInfo {
  file?: string;
  title?: string;
  description?: string;
  button?: TypeButton[];
  questionAnswer?: { question: string; answer: string }[];
  pendingFile?: File | null; // Add this for tracking new files
  previousFileUrl?: string | null; // Add this for tracking files to be replaced
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
    | {
        gotoNodeId: string;
      }[]
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
export interface TypeButton {
  id: string;
  title: string;
  type: string;
  message?: string;
  url?: string;
  phoneNumber?: string;
  goto?: string;
}

export interface TypePlaygroundNode {
  id: string;
  type: string;
  data: {
    label: string;
    message: string;
    isDelete: boolean;
  };
  position: {
    x: number;
    y: number;
  };
}
export interface TypeSimpleNode {
  id: string;
  label: string;
  type: string;
}
