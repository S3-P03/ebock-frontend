import { Wear } from "interfaces/Wear";
import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/wear";

export async function getWearList(): Promise<Wear[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`);
    return (Array.isArray(response.data) ? response.data : []) as Wear[];
  } catch (error: any) {
    if (error.status === 404) {
      emitApiError("Aucune condition trouvée", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des conditions", error.status ?? 500);
    }
    return [];
  }
}
