export interface DetailedItem {
    itemId: number;
    name: string;
    description: string;
    price: number;
    addedAt: string;
    quantity: number;
    category: string;
    wear: string;
    sellerCip: string;
    paymentOptions: string[];
    deliveryOptions: string[];
    tags: number[];
}

export interface ItemImage {
    itemId: number;
    url: string;
    guid: string;
    displayOrder: number;
}

export interface ItemComment {
    idComment: number;
    content: string;
    idParentComment: number | null;
    firstName: string;
    lastName: string;
    timestamp: string;
}

export interface ItemPayload {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: number;
    wearId: number;
    tagList: number[];
    paymentOptionList: number[];
    deliveryOptionList: number[];
    imageList: {
        guid: string, 
        displayorder: number
    }[];
}

export interface SellerItem {
  itemId: number;
  name: string;
  favorite: boolean;
  price: number;
  addedAt: string;
  quantity: number;
  categoryId: number;
  wearId: number;
  firstName: string;
  lastName: string;
  tags: number[];
  firstImage?: string;
}