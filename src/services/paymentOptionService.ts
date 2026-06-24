import { PaymentOption } from "interfaces/PaymentOption";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/paymentOption";

export async function getPaymentList(): Promise<PaymentOption[]> {
  try {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);
    return (Array.isArray(response.data) ? response.data : []) as PaymentOption[];
  } catch (error) {
    return [];
  }
}
