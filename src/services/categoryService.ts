import { Category } from "interfaces/Category";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/category";

export async function fetchCategories(): Promise<Category[] | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);

  try {
    return response.data as Category[];
  } catch (error) {
    console.error(error);
    return null;
  }
}