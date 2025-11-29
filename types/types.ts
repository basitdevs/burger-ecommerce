// import { RestaurantInfo, Product, Category } from "@/lib/db";

// export interface ExtendedRestaurantInfo extends RestaurantInfo {
//   address?: string;
//   email?: string;
// }

// export type { Product, Category };

import { RestaurantInfo, Product, Category } from "@/lib/db";

// Re-export RestaurantInfo directly since it now has all fields
export type ExtendedRestaurantInfo = RestaurantInfo;

export type { Product, Category };