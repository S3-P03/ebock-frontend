import { Wear } from "interfaces/Wear";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/wear";

export async function fetchWears(): Promise<Wear[] | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);

  try {
    return response.data as Wear[];
  } catch (error) {
    console.error(error);
    return null;
  }
}