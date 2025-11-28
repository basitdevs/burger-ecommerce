import { RestaurantInfo, Product, Category } from "@/lib/db";

export interface ExtendedRestaurantInfo extends RestaurantInfo {
  address?: string;
  email?: string;
}

export type { Product, Category };