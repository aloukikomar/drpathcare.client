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
   Helper: Create a clean Axios instance with unwrapped JSON
---------------------------------------------------- */
const createApiInstance = (): TypedAxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
  });

  /* -------------------------
     RESPONSE INTERCEPTOR
     - Accept ALL 2xx
     - Always unwrap response.data
  -------------------------- */
  instance.interceptors.response.use(
    (res: AxiosResponse) => res.data, // unwrap
    (error: AxiosError) => {
      const serverError = (error.response?.data as any)?.detail ||
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

/* -------------------------
   REQUEST INTERCEPTOR (Auth)
-------------------------- */
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

/* -------------------------
   RESPONSE INTERCEPTOR (401 handler)
-------------------------- */
(customerApi as any).interceptors.response.use(
  (res: any) => res, // res is already unwrapped JSON
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clean tokens
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Silent fallback — no navigate() here
      console.warn("Authentication expired. Clearing session.");

      // Force hard reload to login page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default globalApi;
