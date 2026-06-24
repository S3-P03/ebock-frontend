import apiClient from "./apiClient";
import { PaymentOption } from "interfaces/PaymentOption";

const SERVICE_BASE_URL = "/paymentOption";

export async function fetchPaymentOptions(): Promise<PaymentOption[] | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/list`);

  try {
    return response.data as PaymentOption[];
  } catch (error) {
    console.error(error);
    return null;
  }
}