import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;
const API_ERROR_EVENT = "api_error";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const emitApiError = (error: string, status: number) => {

  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: { error, status } }));
};

export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};