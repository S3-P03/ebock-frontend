export interface Category {
  categoryId: number;
  name: string;
  parentCategory: Category | null;
}