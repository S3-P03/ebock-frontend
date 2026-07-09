import { PaymentOption } from "interfaces/PaymentOption";
import apiClient, { emitApiError } from "./apiClient";

const SERVICE_BASE_URL = "/paymentOption";

export async function getPaymentList(): Promise<PaymentOption[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}`);
    return (Array.isArray(response.data) ? response.data : []) as PaymentOption[];
  } catch (error: any) {
    if(error.status === 404) {
      emitApiError("Aucune option de paiement trouvée", error.status);
    } else {
      emitApiError("Erreur lors de la récupération des options de paiement", error.status ?? 500);
    }
    return [];
  }
}
