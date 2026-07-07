import { User } from "./User";
import { SellerItem } from "./Item";

export interface SellerUser {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  createdAt: Date;
  soldItems: number;
}

export interface SellerUserRaw {
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  createdAt: string;
  soldItems: number;
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