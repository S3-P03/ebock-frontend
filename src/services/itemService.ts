// services/itemService.ts
import { SellerItem} from "../interfaces/Seller";
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