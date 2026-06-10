import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreditCard, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_IMAGES } from "@/lib/marketplace/data";
import { useCart } from "@/hooks/use-cart";
import { useCatalog } from "@/hooks/use-catalog";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — MediFind" },
      { name: "description", content: "Review your medical equipment order and check out securely." },
      { property: "og:title", content: "Your Cart — MediFind" },
      { property: "og:description", content: "Review your medical equipment order and check out securely." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQuantity, removeItem, subtotal, itemCount } = useCart();
  const { getProduct } = useCatalog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 6.99;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <ShoppingCart className="size-7" />
          </div>
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">Find the equipment you need in the marketplace.</p>
          <Button asChild className="mt-5">
            <Link to="/">Browse products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Your Cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{itemCount} item{itemCount === 1 ? "" : "s"}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {items.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            return (
              <div key={item.productId} className="flex gap-4 rounded-xl border bg-card p-4">
                <Link to="/product/$productId" params={{ productId: product.id }} className="shrink-0">
                  <img
                    src={CATEGORY_IMAGES[product.categoryId]}
                    alt={product.name}
                    loading="lazy"
                    width={768}
                    height={768}
                    className="size-20 rounded-lg object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to="/product/$productId" params={{ productId: product.id }}>
                    <p className="line-clamp-2 text-sm font-semibold hover:underline">{product.name}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-lg border">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => setQuantity(product.id, item.quantity - 1)} aria-label="Decrease quantity">
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => setQuantity(product.id, item.quantity + 1)} aria-label="Increase quantity">
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => removeItem(product.id)}>
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  </div>
                </div>
                <p className="shrink-0 text-sm font-bold">${(product.price * item.quantity).toFixed(2)}</p>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded-xl border bg-card p-5">
          <h2 className="text-base font-bold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>${(subtotal + shipping).toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="mt-5 w-full"
            size="lg"
            onClick={() => {
              if (!user) {
                navigate({ to: "/auth", search: { redirect: "/checkout" } });
                return;
              }
              navigate({ to: "/checkout" });
            }}
          >
            <CreditCard className="size-4" /> Checkout
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Secure card payment with tax calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
