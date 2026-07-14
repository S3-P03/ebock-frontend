import { DeliveryOption } from "interfaces/DeliveryOption";
import apiClient, { emitApiError } from "./apiClient";
import { CategoryInfo } from "interfaces/Category";

const SERVICE_BASE_URL = "/deliveryOption";

interface FetchOptions {
  token: string;
  logout: () => void;
}

export async function getDeliveryList(): Promise<DeliveryOption[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`);
    return (Array.isArray(response.data) ? response.data : []) as DeliveryOption[];
  } catch (error: any) {
    if(error.status === 404) {
      emitApiError("Aucune option de livraison trouvée", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des options de livraison", error.status ?? 500);
    }
    return [];
  }
}

export async function fetchDeliveryOptionList({ token, logout }: FetchOptions): Promise<CategoryInfo[] | null> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }

    return response.data.map((item: any) => ({
      categoryId: item.deliveryOptnId,
      name: item.name,
    }));

  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des options de livraison", error.status ?? 500);
    return null;
  }
}

export async function createDeliveryOption({ token, logout }: FetchOptions, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.post(`${SERVICE_BASE_URL}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la création de l'option de livraison", error.status ?? 500);
        return false;
  }
}

export async function updateDeliveryOption({ token, logout }: FetchOptions, id: number, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
    try {
        const response = await apiClient.put(`${SERVICE_BASE_URL}/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la mise à jour de l'option de livraison", error.response?.status ?? 500);
        return false;
    }
}

export async function deleteDeliveryOption({ token, logout }: FetchOptions, id: number): Promise<boolean> {
    try {
        const response = await apiClient.delete(`${SERVICE_BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401) {
            logout();
            return false;
        } 
        return true;
    } catch (error: any) {
        emitApiError("Erreur lors de la suppression de l'option de livraison", error.response?.status ?? 500);
        return false;
    }
}
