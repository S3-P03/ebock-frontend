import { User } from "./User";

export interface SellerItem {
  id: number;
  name: string;
  description: string;
  price: number;
  addedAt: string;
  updatedAt: string | null;
  sold: boolean;
  quantity: number;
  archived: boolean;
  categoryId: number;
  wearId: number;
  sellerCip: string;
  location: string;
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