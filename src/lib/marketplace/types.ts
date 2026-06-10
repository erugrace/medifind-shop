export type CategoryId =
  | "vision"
  | "vitamins"
  | "medical"
  | "care"
  | "mobility"
  | "fitness"
  | "recovery"
  | "therapy"
  | "monitoring"
  | "sleep"
  | "wellness"
  | "nutrition";

export type SellerType = "individual" | "certified" | "hospital" | "brand";

export type Condition = "new" | "refurbished" | "used";

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  blurb: string;
  subcategories: string[];
}

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  verified: boolean;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  subcategory: string;
  sellerId: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  condition: Condition;
  inStock: boolean;
  shipsIn24h: boolean;
  localPickup: boolean;
  nearbyStores: boolean;
  freeShipping: boolean;
  clearance: boolean;
  bundle: boolean;
  limitedTime: boolean;
  bulkPricing: boolean;
  description: string;
}

export const SELLER_TYPE_LABELS: Record<SellerType, string> = {
  individual: "Individual Seller",
  certified: "Certified Medical Supplier",
  hospital: "Hospital Supplier",
  brand: "Brand Official Store",
};

export const CONDITION_LABELS: Record<Condition, string> = {
  new: "New",
  refurbished: "Certified Refurbished",
  used: "Used — Good Condition",
};

export function discountPct(p: Product): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}
