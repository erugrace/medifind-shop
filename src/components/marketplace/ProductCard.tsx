import { Link } from "@tanstack/react-router";
import { BadgeCheck, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./RatingStars";
import { CATEGORY_IMAGES } from "@/lib/marketplace/data";
import { discountPct, SELLER_TYPE_LABELS, type Product } from "@/lib/marketplace/types";
import { useCart } from "@/hooks/use-cart";
import { useCatalog } from "@/hooks/use-catalog";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { getSeller } = useCatalog();
  const seller = getSeller(product.sellerId);
  const pct = discountPct(product);
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link to="/product/$productId" params={{ productId: product.id }} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={CATEGORY_IMAGES[product.categoryId]}
            alt={product.name}
            loading="lazy"
            width={768}
            height={768}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {pct > 0 && <Badge className="bg-deal text-deal-foreground">-{pct}%</Badge>}
            {product.clearance && <Badge variant="secondary">Clearance</Badge>}
            {product.limitedTime && <Badge variant="outline" className="bg-card">Limited time</Badge>}
            {product.condition !== "new" && (
              <Badge variant="outline" className="bg-card">
                {product.condition === "refurbished" ? "Refurbished" : "Used"}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1.5">
            <RatingStars rating={product.rating} />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount.toLocaleString()})
            </span>
          </div>
          {seller && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {seller.verified && <BadgeCheck className="size-3.5 text-primary" />}
              {seller.name} · {SELLER_TYPE_LABELS[seller.type]}
            </p>
          )}
          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.freeShipping && <p className="text-xs font-medium text-success">Free shipping</p>}
        </div>
      </Link>
      <div className="p-3 pt-0">
        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            addItem(product.id);
            toast.success(`Added "${product.name}" to cart`);
          }}
        >
          <ShoppingCart className="size-4" />
          Add to cart
        </Button>
      </div>
    </div>
  );
}
