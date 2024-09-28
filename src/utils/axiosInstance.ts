import Axios, {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Get the current URL or path
  const requestUrl = config.url || "";

  // Define the api routes where the token should NOT be passed
  const noAuthPages = [
    "/register",
    "/verify-email",
    "/resend-verification-email",
    "/login",
  ];

  // Check if the request URL matches any of the noAuthPages
  const shouldSkipAuth = noAuthPages.some((page) => requestUrl.includes(page));

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (!shouldSkipAuth) {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
  }

  config.headers.Accept = "application/json";
  return config;
};

// const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
//   const authToken = Cookies.get("authToken");
//   config.headers = config.headers ?? {};

//   if (authToken) {
//     config.headers.Authorization = `Bearer ${authToken}`;
//   }
//   config.headers.Accept = "application/json";

//   return config;
// };
const responseInterceptor = (response: AxiosResponse) => response.data;

const errorInterceptor = (error: AxiosError) => {
  if (!error.response) {
    // Handle network/server issues
    if (error.code !== "ERR_CANCELED") {
      toast.error("Server or network error occurred");
    }
    return Promise.reject(error);
  }

  if (error.response.status === 401) {
    window.location.replace("/login");
    toast.error("Authentication required, please log in");
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
