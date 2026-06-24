import { DetailedItem, ItemImage, SellerItem } from "interfaces/Item";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/item";

export interface FilterParams {
  minP?: number;
  maxP?: number;
  maxD?: number;
  fav?: boolean;
  categories?: number[];
  tags?: number[];
  wears?: number[];
  deliveries?: number[];
  payments?: number[];
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
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${id}`);

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

export async function getFilteredItems(pageNumber: number, filters: FilterParams): Promise<SellerItem[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters.minP !== undefined) params.append("minP", String(filters.minP));
    if (filters.maxP !== undefined) params.append("maxP", String(filters.maxP));
    if (filters.maxD !== undefined) params.append("maxD", String(filters.maxD));
    if (filters.fav !== undefined) params.append("fav", String(filters.fav));
    if (filters.categories?.length) params.append("categories", filters.categories.join(","));
    if (filters.tags?.length) params.append("tags", filters.tags.join(","));
    if (filters.wears?.length) params.append("wears", filters.wears.join(","));
    if (filters.deliveries?.length) params.append("deliveries", filters.deliveries.join(","));
    if (filters.payments?.length) params.append("payments", filters.payments.join(","));

    const queryString = params.toString();
    const url = `${SERVICE_BASE_URL}/list/${pageNumber}${queryString ? `?${queryString}` : ""}`;
    
    const response = await apiClient.get(url);
    return (Array.isArray(response.data) ? response.data : []) as SellerItem[];
  } catch (error) {
    console.error("Error fetching filtered items:", error);
    return [];
  }
}