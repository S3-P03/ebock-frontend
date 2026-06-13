import { DetailedItem } from "../interfaces/Item";
import apiClient from "./apiClient";

export async function fetchItem(id: string | undefined): Promise<DetailedItem | null> {
    const response = await apiClient.get(`/item/${id}`);

  try {
    return (await response.data) as DetailedItem;
  } catch (error) {
    console.error(error);
    return null;
  }
}