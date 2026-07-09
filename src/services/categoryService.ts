import { Category } from "interfaces/Category";
import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/category";

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
