import { DetailedItem, ItemImage, SellerItem, ItemPayload } from "interfaces/Item";
import apiClient, { emitApiError } from "./apiClient";

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
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/storefront`);
    const items = (await response.data) as SellerItem[];
    return items;
  } catch (error) {
    return null;
  }
}

export async function fetchItem(id: string | undefined): Promise<DetailedItem | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${id}`);
    return (await response.data) as DetailedItem;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      emitApiError("Item introuvable", 404);
    } else {
      emitApiError("Erreur lors de la récupération de l'item", error.response?.status || 500);
    }
    return null;
  }
}

export async function fetchItemImages(id: string | undefined): Promise<ItemImage[] | null> {
  try {
    const response = await apiClient.get(`/image/forItem/${id}`);
    return (await response.data) as ItemImage[];
  } catch (error) {
    return null;
  }
}

export async function addItem(item : ItemPayload, token: string): Promise<{itemId: number} | null> {
  
  try {
    const response = await apiClient.post(`${SERVICE_BASE_URL}`,
        {
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            categoryId: item.categoryId,
            wearId: item.wearId,
            tagList: item.tagList,
            deliveryOptionList: item.deliveryOptionList,
            paymentOptionList: item.paymentOptionList,
            imageList: item.imageList
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },   
        }
    );

    return (await response.data) as {itemId: number};
  } catch (error: any) {
    emitApiError("Erreur lors de l'ajout de l'item, veuillez vérifier les données fournies", error.status);
    return null;
  }
}

export async function getFilteredItems(token: string, pageNumber: number, filters: FilterParams): Promise<SellerItem[]> {
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
    
    const response = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return (Array.isArray(response.data) ? response.data : []) as SellerItem[];
  } catch (error) {
    emitApiError("Erreur lors de la récupération des items", 404);
    return [];
  }
}

export async function favoriteItem(id: number, token: string): Promise<void> {
  try {
    await apiClient.post(`${SERVICE_BASE_URL}/${id}/favorite`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    emitApiError("Erreur lors de la mise en favori de l'article", 401);
  }
}

export async function unfavoriteItem(id: number, token: string): Promise<void> {
  try {
    await apiClient.post(`${SERVICE_BASE_URL}/${id}/unfavorite`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    emitApiError("Erreur lors du retrait du favori de l'article", 401);
  }
}