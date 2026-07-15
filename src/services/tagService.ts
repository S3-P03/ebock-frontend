import { Tag } from "interfaces/Tag";
import apiClient, { emitApiError } from "./apiClient";
import { SpecificationInfo } from "interfaces/Specification";

const SERVICE_BASE_URL = "/tag";

interface FetchOptions {
  token: string;
  logout: () => void;
}

export async function getTagList(): Promise<Tag[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`);
    return (Array.isArray(response.data) ? response.data : []) as Tag[];
  } catch (error: any) {
    if (error.status === 404) {
      emitApiError("Aucun tag trouvé", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des tags", error.status ?? 500);
    }
    return [];
  }
}

export async function fetchTagList({ token, logout }: FetchOptions): Promise<SpecificationInfo[] | null> {
  try {
    const response = await apiClient.get(`tag`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) {
      logout();
      return null;
    }
    return response.data.map((item: any) => ({
      specificationId: item.tagId,
      name: item.name,
    }));
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des tags", error.status ?? 500);
    return null;
  }
}

export async function createTag({ token, logout }: FetchOptions, payload: {name: string}): Promise<boolean> {
    try {
        const response = await apiClient.post(`tag`, payload, {
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
        emitApiError("Erreur lors de la création du tag", error.status ?? 500);
        return false;
  }
}

export async function updateTag({ token, logout }: FetchOptions, id: number, payload: {name: string}): Promise<boolean> {
    try {
        const response = await apiClient.put(`tag/${id}`, payload, {
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
        emitApiError("Erreur lors de la mise à jour du tag", error.response?.status ?? 500);
        return false;
    }
}

export async function deleteTag({ token, logout }: FetchOptions, id: number): Promise<boolean> {
    try {
        const response = await apiClient.delete(`tag/${id}`, {
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
        emitApiError("Erreur lors de la suppression du tag", error.response?.status ?? 500);
        return false;
    }
}
