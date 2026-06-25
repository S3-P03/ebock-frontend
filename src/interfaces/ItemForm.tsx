export type UploadStatus = "Uploading" | "Uploaded" | "Error";

export interface ImageEntry {
  localId: string;
  file: File;
  guid: string;
  previewUrl: string;
  displayOrder: number;
  status: UploadStatus;
  uploadError?: string;
}

export interface ItemFormState {
  name: string;
  description: string;
  price: string;
  quantity: number;
  categoryId: number | "";
  wearId: number | "";
  paymentOptionList: number[];
  deliveryOptionList: number[];
  tagList: number[];
  imageList: ImageEntry[];
}
 
export interface ItemFormErrors {
  name?: string;
  description?: string;
  price?: string;
  quantity?: string;
  categoryId?: string;
  wearId?: string;
  paymentOptionList?: string;
  deliveryOptionList?: string;
  tagList?: string;
  imageList?: string;
}