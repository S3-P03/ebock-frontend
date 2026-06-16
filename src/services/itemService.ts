import { DetailedItem, ItemImage } from "../interfaces/Item";
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

export async function fetchItemImages(id: string | undefined): Promise<ItemImage[] | null> {
  const response = await apiClient.get(`/image/forItem/${id}`);

  try {
    return (await response.data) as ItemImage[];
  } catch (error) {
    console.error(error);
    return null;
  }
}