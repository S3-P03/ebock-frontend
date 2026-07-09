import { Tag } from "interfaces/Tag";
import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/tag";

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
