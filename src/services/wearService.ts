import { Wear } from "interfaces/Wear";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/wear";

export async function getWearList(): Promise<Wear[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);
    return (Array.isArray(response.data) ? response.data : []) as Wear[];
  } catch (error) {
    return [];
  }
}
