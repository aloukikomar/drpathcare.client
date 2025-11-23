import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/";

interface TypedAxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

/* ---------------------------------------------------
   Helper: Create a clean Axios instance with unified handling
---------------------------------------------------- */
const createApiInstance = (): TypedAxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
  });

  /* ---------------------------------------------------
     RESPONSE INTERCEPTOR  (✔ unified)
     - unwrap all successful responses
     - handle 401 logout globally
     - handle backend error messages
  ---------------------------------------------------- */
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response.data; // always unwrap
    },

    async (error: AxiosError) => {
      const status = error.response?.status;

      // 🔥 GLOBAL 401 HANDLING — ALWAYS WORKS
      if (status === 401) {
        console.warn("401 Unauthorized — clearing session…");

        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // Hard reload to login/homepage
        window.location.href = "/";
        return;
      }

      // Extract backend error message
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
   REQUEST INTERCEPTOR (Auth Token)
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
