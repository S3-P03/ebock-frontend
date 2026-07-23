import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_ERROR_EVENT = "api_error";
const ENV_STORAGE_KEY = "app_environment";
const REDACTED_EBOCK_ENV = process.env.REACT_APP_REDACTED_EBOCK_ENV;

let currentAuthToken = "";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// --- environment cache helpers ---

export const setRedactedEbockEnvironment = (enabled: boolean) => {
  if (enabled) {
    localStorage.setItem(ENV_STORAGE_KEY, REDACTED_EBOCK_ENV ? REDACTED_EBOCK_ENV : "bad_env");
  } else {
    localStorage.removeItem(ENV_STORAGE_KEY);
  }
};

export const isRedactedEbockEnvironment = (): boolean => {
  return localStorage.getItem(ENV_STORAGE_KEY) === REDACTED_EBOCK_ENV;
};

export const setCurrentAuthToken = (token: string) => {
  currentAuthToken = token;
};

export const getImageUrlWithEnvironment = async (url: string | null): Promise<string | null> => {
  if (!url) return null;
  
  if (!isRedactedEbockEnvironment()) {
    return url;
  }
  
  try {
    const response = await axiosInstance.get(url, { responseType: 'blob' });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Failed to fetch image with environment header", error);
    return null;
  }
};

// --- inject header on every request ---

axiosInstance.interceptors.request.use((config) => {
  if (isRedactedEbockEnvironment()) {
    config.headers = config.headers ?? {};
    config.headers["Environment"] = REDACTED_EBOCK_ENV;
    
    if (currentAuthToken) {
      config.headers["Authorization"] = `Bearer ${currentAuthToken}`;
    }
  }
  return config;
});

export { API_BASE_URL, REDACTED_EBOCK_ENV };

export const emitApiError = (error: string, status: number) => {
  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: { error, status } }));
};

export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};