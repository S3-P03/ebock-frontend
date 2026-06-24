import { SellerItem} from "../interfaces/Seller";
import { DetailedItem, ItemImage, ItemPayload } from "../interfaces/Item";
import apiClient from "./apiClient";

const SERVICE_BASE_URL = "/item";

export async function fetchUserItems(cip: string | undefined): Promise<SellerItem[] | null> {
  const response = await apiClient.get(`${SERVICE_BASE_URL}/${cip}/storefront`);
  try {
    const items = (await response.data) as SellerItem[];
    return items;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchItem(id: string | undefined): Promise<DetailedItem | null> {
    const response = await apiClient.get(`${SERVICE_BASE_URL}/${id}`);

  try {
    return (await response.data) as DetailedItem;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchItemImages(id: string | undefined): Promise<ItemImage[] | null> {
  const response = await apiClient.get(`/image/forItem/${id}`);

  try {
    return (await response.data) as ItemImage[];
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addItem(item : ItemPayload, token: string): Promise<DetailedItem | null> {
  const response = await apiClient.post(`${SERVICE_BASE_URL}/insert`,
        {
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            categoryId: item.categoryId,
            wearId: item.wearId,
            tagList: item.tagList,
            deliveryOptionList: item.deliveryOptionList,
            paymentOptionList: item.paymentOptionList,
            imageList: item.imageList
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },   
        }
    );

  try {
    return (await response.data) as DetailedItem;
  } catch (error) {
    console.error(error);
    return null;
  }
}