import { Category } from "interfaces/Category";
import { SpecificationInfo } from "interfaces/Specification";
import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/category";

interface FetchOptions {
  token: string;
  logout: () => void;
}

export async function getCategoryList(): Promise<Category[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`);
    return (Array.isArray(response.data) ? response.data : []) as Category[];
  } catch (error: any) {
    if(error.status === 404) {
      emitApiError("Aucune catégorie trouvée", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des catégories", error.status ?? 500);
    }
    return [];
  }
}

export async function fetchCategoryList({ token, logout }: FetchOptions): Promise<SpecificationInfo[] | null> {
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
      specificationId: item.categoryId,
      name: item.name,
      parentSpecification: item.parentCategory
    }));
  } catch (error: any) {
    emitApiError("Erreur lors de la récupération des catégories", error.status ?? 500);
    return null;
  }
}

export async function createCategory({ token, logout }: FetchOptions, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
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
        emitApiError("Erreur lors de la création de la catégorie", error.status ?? 500);
        return false;
  }
}

export async function updateCategory({ token, logout }: FetchOptions, id: number, payload: {name: string, parentCategory: number | null}): Promise<boolean> {
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
        emitApiError("Erreur lors de la mise à jour de la catégorie", error.response?.status ?? 500);
        return false;
    }
}

export async function deleteCategory({ token, logout }: FetchOptions, id: number): Promise<boolean> {
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
        emitApiError("Erreur lors de la suppression de la catégorie", error.response?.status ?? 500);
        return false;
    }
}
