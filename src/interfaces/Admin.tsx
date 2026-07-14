export interface Users {
    cip: string;
    firstName: string;
    lastName: string;
    email: string;
    enabled: boolean;
}

export interface Category {
  categoryId: number;
  name: string;
  parentCategory: number | null;
}

export interface CategoryPayload {
  name: string;
  parentCategory: number | null;
}