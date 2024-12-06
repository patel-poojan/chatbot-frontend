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
  response: {
    delay: number;
    title: string;
    type: string;
    filters: [];
    matchAll: boolean;
    buttons: [];
  }[];
}
