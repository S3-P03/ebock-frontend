import { Tag } from "interfaces/Tag";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/tag";

export async function getTagList(): Promise<Tag[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`);
    return (Array.isArray(response.data) ? response.data : []) as Tag[];
  } catch (error) {
    return [];
  }
}
