import { Category } from "interfaces/Category";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/category";

export async function getCategoryList(): Promise<Category[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`);
    return (Array.isArray(response.data) ? response.data : []) as Category[];
  } catch (error) {
    return [];
  }
}
