export interface Category {
  categoryId: number;
  name: string;
  parentCategory: Category | null;
}

export interface CategoryInfo {
  categoryId: number;
  name: string;
  parentCategory: number | null;
}
