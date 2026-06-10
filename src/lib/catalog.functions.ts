import { createServerFn } from "@tanstack/react-start";
import type { CategoryId, Condition, Product, Seller, SellerType } from "@/lib/marketplace/types";

export interface CatalogPayload {
  products: Product[];
  sellers: Seller[];
  error?: string;
}

interface ProductRow {
  id: string;
  seller_id: string;
  name: string;
  brand: string;
  category_id: string;
  subcategory: string;
  price: number;
  original_price: number | null;
  rating: number;
  review_count: number;
  condition: string;
  in_stock: boolean;
  ships_in_24h: boolean;
  local_pickup: boolean;
  nearby_stores: boolean;
  free_shipping: boolean;
  clearance: boolean;
  bundle: boolean;
  limited_time: boolean;
  bulk_pricing: boolean;
  description: string;
}

interface SellerRow {
  id: string;
  name: string;
  type: string;
  verified: boolean;
  rating: number;
}

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    categoryId: row.category_id as CategoryId,
    subcategory: row.subcategory,
    sellerId: row.seller_id,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    condition: row.condition as Condition,
    inStock: row.in_stock,
    shipsIn24h: row.ships_in_24h,
    localPickup: row.local_pickup,
    nearbyStores: row.nearby_stores,
    freeShipping: row.free_shipping,
    clearance: row.clearance,
    bundle: row.bundle,
    limitedTime: row.limited_time,
    bulkPricing: row.bulk_pricing,
    description: row.description,
  };
}

export const getCatalog = createServerFn({ method: "GET" }).handler(
  async (): Promise<CatalogPayload> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const [sellersRes, productsRes] = await Promise.all([
        supabaseAdmin.from("sellers").select("id,name,type,verified,rating"),
        supabaseAdmin
          .from("products")
          .select(
            "id,seller_id,name,brand,category_id,subcategory,price,original_price,rating,review_count,condition,in_stock,ships_in_24h,local_pickup,nearby_stores,free_shipping,clearance,bundle,limited_time,bulk_pricing,description",
          )
          .eq("active", true)
          .order("created_at", { ascending: true }),
      ]);
      if (sellersRes.error || productsRes.error) {
        console.error("Catalog load failed", sellersRes.error ?? productsRes.error);
        return { products: [], sellers: [], error: "Catalog temporarily unavailable" };
      }
      const sellers: Seller[] = (sellersRes.data as SellerRow[]).map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type as SellerType,
        verified: s.verified,
        rating: Number(s.rating),
      }));
      const products = (productsRes.data as ProductRow[]).map(mapProductRow);
      return { products, sellers };
    } catch (e) {
      console.error("Catalog load crashed", e);
      return { products: [], sellers: [], error: "Catalog temporarily unavailable" };
    }
  },
);
