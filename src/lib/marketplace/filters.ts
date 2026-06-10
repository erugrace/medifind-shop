import { TOP_BRANDS, getSeller } from "./data";
import { discountPct, type CategoryId, type Condition, type Product, type SellerType } from "./types";

export const PRICE_MAX = 600;

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "most-reviewed";

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
  "most-reviewed": "Most Reviewed",
};

export const BUDGET_TIERS = [
  { id: "u25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 – $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-250", label: "$100 – $250", min: 100, max: 250 },
  { id: "250-500", label: "$250 – $500", min: 250, max: 500 },
  { id: "500p", label: "$500+", min: 500, max: Infinity },
] as const;

export interface FilterState {
  search: string;
  priceRange: [number, number];
  budgetTiers: string[];
  brands: string[];
  topBrandsOnly: boolean;
  categories: CategoryId[];
  subcategories: string[];
  onSale: boolean;
  discountTier: 0 | 10 | 25 | 50;
  clearance: boolean;
  bundles: boolean;
  freeShipping: boolean;
  limitedTime: boolean;
  bulkPricing: boolean;
  minRating: 0 | 3 | 4 | 4.5;
  inStockOnly: boolean;
  shipsIn24h: boolean;
  localPickup: boolean;
  nearbyStores: boolean;
  sellerTypes: SellerType[];
  verifiedSellersOnly: boolean;
  conditions: Condition[];
  sort: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  priceRange: [0, PRICE_MAX],
  budgetTiers: [],
  brands: [],
  topBrandsOnly: false,
  categories: [],
  subcategories: [],
  onSale: false,
  discountTier: 0,
  clearance: false,
  bundles: false,
  freeShipping: false,
  limitedTime: false,
  bulkPricing: false,
  minRating: 0,
  inStockOnly: false,
  shipsIn24h: false,
  localPickup: false,
  nearbyStores: false,
  sellerTypes: [],
  verifiedSellersOnly: false,
  conditions: [],
  sort: "featured",
};

export function countActiveFilters(f: FilterState): number {
  let c = 0;
  if (f.priceRange[0] > 0 || f.priceRange[1] < PRICE_MAX) c++;
  c += f.budgetTiers.length;
  c += f.brands.length;
  if (f.topBrandsOnly) c++;
  c += f.categories.length;
  c += f.subcategories.length;
  for (const b of [f.onSale, f.clearance, f.bundles, f.freeShipping, f.limitedTime, f.bulkPricing, f.inStockOnly, f.shipsIn24h, f.localPickup, f.nearbyStores, f.verifiedSellersOnly]) {
    if (b) c++;
  }
  if (f.discountTier > 0) c++;
  if (f.minRating > 0) c++;
  c += f.sellerTypes.length;
  c += f.conditions.length;
  return c;
}

export function applyFilters(
  products: Product[],
  f: FilterState,
  getSellerFn: (id: string) => Seller | undefined = getSeller,
): Product[] {
  const search = f.search.trim().toLowerCase();
  let result = products.filter((p) => {
    if (search) {
      const hay = `${p.name} ${p.brand} ${p.subcategory} ${p.description}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (p.price < f.priceRange[0] || p.price > f.priceRange[1]) return false;
    if (f.budgetTiers.length > 0) {
      const inTier = f.budgetTiers.some((id) => {
        const t = BUDGET_TIERS.find((x) => x.id === id);
        return t ? p.price >= t.min && p.price < t.max : false;
      });
      if (!inTier) return false;
    }
    if (f.brands.length > 0 && !f.brands.includes(p.brand)) return false;
    if (f.topBrandsOnly && !TOP_BRANDS.includes(p.brand)) return false;
    if (f.categories.length > 0 && !f.categories.includes(p.categoryId)) return false;
    if (f.subcategories.length > 0 && !f.subcategories.includes(p.subcategory)) return false;
    const pct = discountPct(p);
    if (f.onSale && pct === 0) return false;
    if (f.discountTier > 0 && pct < f.discountTier) return false;
    if (f.clearance && !p.clearance) return false;
    if (f.bundles && !p.bundle) return false;
    if (f.freeShipping && !p.freeShipping) return false;
    if (f.limitedTime && !p.limitedTime) return false;
    if (f.bulkPricing && !p.bulkPricing) return false;
    if (f.minRating > 0 && p.rating < f.minRating) return false;
    if (f.inStockOnly && !p.inStock) return false;
    if (f.shipsIn24h && !p.shipsIn24h) return false;
    if (f.localPickup && !p.localPickup) return false;
    if (f.nearbyStores && !p.nearbyStores) return false;
    const seller = getSellerFn(p.sellerId);
    if (f.sellerTypes.length > 0 && (!seller || !f.sellerTypes.includes(seller.type))) return false;
    if (f.verifiedSellersOnly && (!seller || !seller.verified)) return false;
    if (f.conditions.length > 0 && !f.conditions.includes(p.condition)) return false;
    return true;
  });

  switch (f.sort) {
    case "price-asc":
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    case "most-reviewed":
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      result = [...result].sort((a, b) => b.rating * Math.log10(b.reviewCount + 1) - a.rating * Math.log10(a.reviewCount + 1));
  }
  return result;
}
