import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

/* ---------------------------------------------------
   Base URL
---------------------------------------------------- */
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/";

/* ---------------------------------------------------
   Types
---------------------------------------------------- */
interface TypedAxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

/* ---------------------------------------------------
   🔥 URL Normalizer (FIXES DRF http pagination)
---------------------------------------------------- */
const normalizeUrl = (url?: string) => {
  if (!url) return url;

  // Force HTTPS for absolute URLs returned by backend
  if (url.startsWith("http://")) {
    return url.replace(/^http:\/\//i, "https://");
  }

  return url;
};

/* ---------------------------------------------------
   Create Axios Instance
---------------------------------------------------- */
const createApiInstance = (): TypedAxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /* ---------------------------------------------------
     REQUEST INTERCEPTOR
     - Normalize absolute URLs (pagination, media, etc.)
  ---------------------------------------------------- */
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (config.url) {
        config.url = normalizeUrl(config.url);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /* ---------------------------------------------------
     RESPONSE INTERCEPTOR
     - Always unwrap response.data
     - Global 401 handling
     - Clean error messages
  ---------------------------------------------------- */
  instance.interceptors.response.use(
    (response: AxiosResponse) => response.data,

    async (error: AxiosError) => {
      const status = error.response?.status;

      // 🔐 Global auth failure handling
      if (status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/";
        return;
      }

      // Extract backend message safely
      const serverError =
        (error.response?.data as any)?.detail ||
        (error.response?.data as any)?.message;

      const msg =
        serverError ||
        error.response?.statusText ||
        error.message ||
        "Unknown API error";

      return Promise.reject(new Error(msg));
    }
  );

  return instance as unknown as TypedAxiosInstance;
};

/* ---------------------------------------------------
   Global API (no auth)
---------------------------------------------------- */
export const globalApi = createApiInstance();

/* ---------------------------------------------------
   Customer API (auth required)
---------------------------------------------------- */
export const customerApi = createApiInstance();

/* ---------------------------------------------------
   Auth Token Injection
---------------------------------------------------- */
(customerApi as any).interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export default globalApi;
