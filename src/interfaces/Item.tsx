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
    id: number;
    content: string;
    respondToCommentId: number | null;
    authorCip: string;
    authorFirstName: string;
    authorLastName: string;
    timeAgo: string;
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
    imageList: [{
        guid: string, 
        displayOrder: number
    }];
}

export interface SellerItem {
  itemId: number;
  name: string;
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