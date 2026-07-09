import { DeliveryOption } from "interfaces/DeliveryOption";
import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/deliveryOption";

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
