export interface ResponseInfo {
  file?: string;
  title?: string;
  description?: string;
  button?: {
    title: string;
    type: string;
    navigationInfo: string;
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
  response: TypeResponseList[];
}
