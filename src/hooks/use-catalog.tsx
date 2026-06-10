import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCatalog, type CatalogPayload } from "@/lib/catalog.functions";
import { PRODUCTS, SELLERS } from "@/lib/marketplace/data";
import type { Product, Seller } from "@/lib/marketplace/types";

interface CatalogContextValue {
  products: Product[];
  sellers: Seller[];
  getProduct: (id: string) => Product | undefined;
  getSeller: (id: string) => Seller | undefined;
  isLoading: boolean;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const fetchCatalog = useServerFn(getCatalog);
  const { data, isLoading } = useQuery<CatalogPayload>({
    queryKey: ["catalog"],
    queryFn: () => fetchCatalog(),
    staleTime: 60_000,
  });

  const value = useMemo<CatalogContextValue>(() => {
    const products = data && data.products.length > 0 ? data.products : PRODUCTS;
    const sellers = data && data.sellers.length > 0 ? data.sellers : SELLERS;
    const productMap = new Map(products.map((p) => [p.id, p]));
    const sellerMap = new Map(sellers.map((s) => [s.id, s]));
    return {
      products,
      sellers,
      getProduct: (id: string) => productMap.get(id),
      getSeller: (id: string) => sellerMap.get(id),
      isLoading,
    };
  }, [data, isLoading]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
