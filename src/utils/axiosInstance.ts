import Axios, {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
// import Cookies from "js-cookie";

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  // const authToken = Cookies.get("authToken"); // Using js-cookie for better cookie handling
  const authToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];
  if (!config.headers) {
    config.headers = config.headers || new AxiosHeaders();
  }

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  config.headers.Accept = "application/json";
  return config;
};

const responseInterceptor = (response: AxiosResponse) => response.data;

const errorInterceptor = (error: AxiosError) => {
  if (!error.response) {
    // Handle network/server issues
    if (error.code !== "ERR_CANCELED") {
      console.error("Server or network error occurred");
      // toast.error("Something went wrong with server", { duration: 10 * 1000 });
    }
    return Promise.reject(error);
  }

  if (error.response.status === 401) {
    window.location.replace("/login");
    toast.error("Authentication required, please log in", {
      duration: 5 * 1000,
    });
  }

  return Promise.reject(error);
};

const paramsSerializer = (params: { [key: string]: string }) => {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
};

export const axiosInstance = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_SERVER_URL, // No need for extra slashes here
});

axiosInstance.defaults.paramsSerializer = paramsSerializer;
axiosInstance.interceptors.request.use(authRequestInterceptor);
axiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);
