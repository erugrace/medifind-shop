import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Check, Minus, Plus, ShoppingCart, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/marketplace/RatingStars";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { CATEGORY_IMAGES, getCategory, getProduct as getStaticProduct } from "@/lib/marketplace/data";
import { CONDITION_LABELS, SELLER_TYPE_LABELS, discountPct } from "@/lib/marketplace/types";
import { useCart } from "@/hooks/use-cart";
import { useCatalog } from "@/hooks/use-catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => {
    const product = getStaticProduct(params.productId);
    const title = product ? `${product.name} — MediFind` : "Product — MediFind";
    const description = product?.description ?? "Medical equipment product details.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This product may have been removed.</p>
        <Button asChild className="mt-4">
          <Link to="/">Back to marketplace</Link>
        </Button>
      </div>
    </div>
  );
}

function ProductDetail() {
  const { productId } = Route.useParams();
  const { products, getProduct, getSeller, isLoading } = useCatalog();
  const product = getProduct(productId);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    if (isLoading) return null;
    return <ProductNotFound />;
  }

  const seller = getSeller(product.sellerId);
  const category = getCategory(product.categoryId);
  const pct = discountPct(product);
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to marketplace
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border bg-muted">
          <img
            src={CATEGORY_IMAGES[product.categoryId]}
            alt={product.name}
            width={768}
            height={768}
            className="size-full object-cover"
          />
          {pct > 0 && <Badge className="absolute left-3 top-3 bg-deal text-deal-foreground">-{pct}% off</Badge>}
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {category.emoji} {category.name} · {product.subcategory} · {product.brand}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-sm text-muted-foreground">
              {product.rating} · {product.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">{CONDITION_LABELS[product.condition]}</Badge>
            {product.inStock ? (
              <Badge variant="outline" className="text-success"><Check className="size-3" /> In stock</Badge>
            ) : (
              <Badge variant="outline" className="text-destructive">Out of stock</Badge>
            )}
            {product.shipsIn24h && <Badge variant="outline"><Truck className="size-3" /> Ships in 24h</Badge>}
            {product.freeShipping && <Badge variant="outline" className="text-success">Free shipping</Badge>}
            {product.localPickup && <Badge variant="outline">Local pickup</Badge>}
            {product.bulkPricing && <Badge variant="outline">Bulk pricing for clinics</Badge>}
            {product.bundle && <Badge variant="outline">Bundle deal</Badge>}
          </div>

          <Separator className="my-5" />

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border bg-card">
              <Button variant="ghost" size="icon" className="size-9" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus className="size-4" />
              </Button>
              <span className="w-8 text-center text-sm font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" className="size-9" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                <Plus className="size-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 sm:flex-none sm:px-10"
              disabled={!product.inStock}
              onClick={() => {
                addItem(product.id, qty);
                toast.success(`Added ${qty} × "${product.name}" to cart`);
              }}
            >
              <ShoppingCart className="size-4" /> Add to cart
            </Button>
          </div>

          {seller && (
            <div className="mt-6 rounded-xl border bg-card p-4">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                {seller.verified && <BadgeCheck className="size-4 text-primary" />}
                {seller.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {SELLER_TYPE_LABELS[seller.type]} · {seller.rating}★ seller rating
                {seller.verified ? " · Verified" : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-bold">More in {category.name}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
