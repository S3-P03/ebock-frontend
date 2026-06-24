import { DeliveryOption } from "interfaces/DeliveryOption";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/deliveryOption";

export async function getDeliveryList(): Promise<DeliveryOption[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);
    return (Array.isArray(response.data) ? response.data : []) as DeliveryOption[];
  } catch (error) {
    console.error("Error fetching delivery list:", error);
    return [];
  }
}
