import { CATEGORIES, PRODUCTS, SELLERS } from "./data";

/** Compact text snapshot of the catalog for AI prompts. */
export function buildCatalogContext(): string {
  const categories = CATEGORIES.map((c) => `${c.id}: ${c.name} (${c.subcategories.join(", ")})`).join("\n");
  const products = PRODUCTS.map((p) => {
    const seller = SELLERS.find((s) => s.id === p.sellerId)?.name ?? "Unknown seller";
    const flags = [
      p.inStock ? "in stock" : "OUT OF STOCK",
      p.shipsIn24h ? "ships 24h" : null,
      p.freeShipping ? "free shipping" : null,
      p.condition !== "new" ? p.condition : null,
    ]
      .filter(Boolean)
      .join(", ");
    return `- id=${p.id} | ${p.name} | ${p.brand} | ${p.categoryId}/${p.subcategory} | $${p.price.toFixed(2)} | ${p.rating}★ (${p.reviewCount}) | ${seller} | ${flags}`;
  }).join("\n");

  return `CATEGORIES:\n${categories}\n\nPRODUCT CATALOG:\n${products}`;
}
