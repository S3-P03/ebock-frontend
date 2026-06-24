import { DeliveryOption } from "interfaces/DeliveryOption";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/deliveryOption";

export async function fetchDeliveryOptions(): Promise<DeliveryOption[] | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);

  try {
    return response.data as DeliveryOption[];
  } catch (error) {
    console.error(error);
    return null;
  }
}