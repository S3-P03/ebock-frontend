import { User } from "./User";

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
}

export interface SellerUser {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  createdAt: Date;
}

export interface SellerUserRaw {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  createdAt: string;
}

export interface SellerExtra {
  seller: User;
  location: string;
  rating: number; //1-5 qqun a rater, si 0 alors y a 0 reviews
  reviewCount: number;
  memberSince: string;
  articlesVendus: number;
  articlesEnVente: number;
  items: SellerItem[];
  reviews: SellerReview[];
}

export interface SellerReview {
  id: number; 
  author: string;
  rating: number; 
  comment: string; 
  timeAgo: string;
}