export interface axiosError {
  response: {
    data: {
      errors: {
        message: string;
      };
      message: string;
    };
  };
}
