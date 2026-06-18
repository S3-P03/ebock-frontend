import { SellerItem} from "../interfaces/Seller";
import { DetailedItem, ItemImage } from "../interfaces/Item";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/item";

interface FetchOptions {
  token: string;
  logout: () => void;
}

export async function fetchUserItems(cip: string | undefined): Promise<SellerItem[] | null> {
  const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/storefront`);
  try {
    const items = (await response.data) as SellerItem[];
    return items;
  } catch (error) {
    console.error(error);
    return null;
  }
}

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