import { Tag } from "interfaces/Tag";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/tag";

export async function fetchTags(): Promise<Tag[] | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);

  try {
    return response.data as Tag[];
  } catch (error) {
    console.error(error);
    return null;
  }
}