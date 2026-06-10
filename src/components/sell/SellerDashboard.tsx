import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Package, Pencil, Plus, Store, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/marketplace/data";
import { SELLER_TYPE_LABELS, type SellerType } from "@/lib/marketplace/types";
import {
  deleteProduct,
  getSellerDashboard,
  registerSeller,
  saveProduct,
} from "@/lib/seller.functions";

interface DashboardProduct {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  subcategory: string;
  price: number;
  original_price: number | null;
  condition: string;
  in_stock: boolean;
  free_shipping: boolean;
  ships_in_24h: boolean;
  active: boolean;
  rating: number;
  review_count: number;
  description: string;
}

interface ProductFormState {
  id?: string;
  name: string;
  brand: string;
  categoryId: string;
  subcategory: string;
  price: string;
  originalPrice: string;
  condition: string;
  description: string;
  inStock: boolean;
  freeShipping: boolean;
  shipsIn24h: boolean;
  active: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  brand: "",
  categoryId: "medical",
  subcategory: "",
  price: "",
  originalPrice: "",
  condition: "new",
  description: "",
  inStock: true,
  freeShipping: false,
  shipsIn24h: false,
  active: true,
};

function ProductFormDialog({
  initial,
  trigger,
  onSaved,
}: {
  initial?: DashboardProduct;
  trigger: React.ReactNode;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const save = useServerFn(saveProduct);

  const openWith = (next: boolean) => {
    if (next) {
      setForm(
        initial
          ? {
              id: initial.id,
              name: initial.name,
              brand: initial.brand,
              categoryId: initial.category_id,
              subcategory: initial.subcategory,
              price: String(initial.price),
              originalPrice: initial.original_price != null ? String(initial.original_price) : "",
              condition: initial.condition,
              description: initial.description,
              inStock: initial.in_stock,
              freeShipping: initial.free_shipping,
              shipsIn24h: initial.ships_in_24h,
              active: initial.active,
            }
          : EMPTY_FORM,
      );
    }
    setOpen(next);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const price = Number.parseFloat(form.price);
      if (!Number.isFinite(price) || price <= 0) throw new Error("Enter a valid price.");
      const originalPrice = form.originalPrice ? Number.parseFloat(form.originalPrice) : null;
      return save({
        data: {
          id: form.id,
          name: form.name,
          brand: form.brand,
          categoryId: form.categoryId,
          subcategory: form.subcategory,
          price,
          originalPrice: Number.isFinite(originalPrice as number) ? originalPrice : null,
          condition: form.condition as "new" | "refurbished" | "used",
          description: form.description,
          inStock: form.inStock,
          freeShipping: form.freeShipping,
          shipsIn24h: form.shipsIn24h,
          active: form.active,
        },
      });
    },
    onSuccess: () => {
      toast.success(form.id ? "Product updated" : "Product listed");
      setOpen(false);
      onSaved();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save the product"),
  });

  return (
    <Dialog open={open} onOpenChange={openWith}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit product" : "New product listing"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Product name</Label>
            <Input id="p-name" required minLength={2} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-brand">Brand</Label>
              <Input id="p-brand" required value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.emoji} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-sub">Subcategory</Label>
              <Input id="p-sub" value={form.subcategory} onChange={(e) => setForm((f) => ({ ...f, subcategory: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Condition</Label>
              <Select value={form.condition} onValueChange={(v) => setForm((f) => ({ ...f, condition: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="refurbished">Certified Refurbished</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price (USD)</Label>
              <Input id="p-price" type="number" step="0.01" min="0.5" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-original">Original price (deal)</Label>
              <Input id="p-original" type="number" step="0.01" min="0.5" value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} placeholder="Optional" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea id="p-desc" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg border p-3">
            <label className="flex items-center justify-between gap-2 text-sm">
              In stock
              <Switch checked={form.inStock} onCheckedChange={(v) => setForm((f) => ({ ...f, inStock: v }))} />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm">
              Free shipping
              <Switch checked={form.freeShipping} onCheckedChange={(v) => setForm((f) => ({ ...f, freeShipping: v }))} />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm">
              Ships in 24h
              <Switch checked={form.shipsIn24h} onCheckedChange={(v) => setForm((f) => ({ ...f, shipsIn24h: v }))} />
            </label>
            <label className="flex items-center justify-between gap-2 text-sm">
              Visible in store
              <Switch checked={form.active} onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))} />
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : initial ? "Save changes" : "List product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RegisterSellerForm({ onDone }: { onDone: () => void }) {
  const register = useServerFn(registerSeller);
  const [name, setName] = useState("");
  const [type, setType] = useState<SellerType>("individual");
  const mutation = useMutation({
    mutationFn: () => register({ data: { name, type } }),
    onSuccess: () => {
      toast.success("Seller profile created — welcome aboard!");
      onDone();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create seller profile"),
  });

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Store className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">Become a seller</h2>
          <p className="text-xs text-muted-foreground">Set up your storefront in seconds.</p>
        </div>
      </div>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="s-name">Store name</Label>
          <Input id="s-name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. CareFirst Supplies" />
        </div>
        <div className="space-y-1.5">
          <Label>Seller type</Label>
          <Select value={type} onValueChange={(v) => setType(v as SellerType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(SELLER_TYPE_LABELS) as SellerType[]).map((t) => (
                <SelectItem key={t} value={t}>{SELLER_TYPE_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating…" : "Create seller profile"}
        </Button>
      </form>
    </div>
  );
}

export function SellerDashboard() {
  const queryClient = useQueryClient();
  const fetchDashboard = useServerFn(getSellerDashboard);
  const removeProduct = useServerFn(deleteProduct);
  const { data, isLoading } = useQuery({
    queryKey: ["seller-dashboard"],
    queryFn: () => fetchDashboard(),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["seller-dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  };

  const deletion = useMutation({
    mutationFn: (id: string) => removeProduct({ data: { id } }),
    onSuccess: () => {
      toast.success("Product removed");
      refresh();
    },
    onError: () => toast.error("Could not remove the product"),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" /> Loading your dashboard…
      </div>
    );
  }

  if (!data?.seller) {
    return (
      <div className="px-4 py-10 md:px-8">
        <RegisterSellerForm onDone={refresh} />
      </div>
    );
  }

  const { seller, products, sales } = data;
  const revenue = sales.reduce((sum, s) => sum + s.unit_price * s.quantity, 0);
  const unitsSold = sales.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            {seller.name}
            {seller.verified && <BadgeCheck className="size-5 text-primary" />}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {SELLER_TYPE_LABELS[seller.type as SellerType] ?? seller.type}
          </p>
        </div>
        <ProductFormDialog
          onSaved={refresh}
          trigger={
            <Button>
              <Plus className="size-4" /> New listing
            </Button>
          }
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Listings</p>
          <p className="mt-1 text-xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Units sold</p>
          <p className="mt-1 text-xl font-bold">{unitsSold}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="mt-1 text-xl font-bold">${revenue.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <Package className="size-4 text-primary" /> Your listings
      </h2>
      {products.length === 0 ? (
        <div className="mt-3 rounded-xl border bg-card p-10 text-center">
          <p className="font-semibold">No listings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first product to start selling on MediFind.
          </p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.brand} · ${Number(p.price).toFixed(2)}
                  {p.original_price != null && (
                    <span className="ml-1 line-through">${Number(p.original_price).toFixed(2)}</span>
                  )}
                </p>
              </div>
              {!p.active && <Badge variant="secondary">Hidden</Badge>}
              {!p.in_stock && <Badge variant="outline">Out of stock</Badge>}
              <ProductFormDialog
                initial={p as DashboardProduct}
                onSaved={refresh}
                trigger={
                  <Button variant="ghost" size="icon" className="size-8" aria-label={`Edit ${p.name}`}>
                    <Pencil className="size-3.5" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive"
                aria-label={`Delete ${p.name}`}
                onClick={() => deletion.mutate(p.id)}
                disabled={deletion.isPending}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 flex items-center gap-2 text-base font-bold">
        <TrendingUp className="size-4 text-primary" /> Recent sales
      </h2>
      {sales.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No sales yet — they'll show up here.</p>
      ) : (
        <div className="mt-3 space-y-1.5 rounded-xl border bg-card p-4">
          {sales.map((s, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate">
                {s.product_name}
                <span className="text-muted-foreground"> × {s.quantity}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" className="capitalize">{s.status}</Badge>
                <span className="font-medium">${(s.unit_price * s.quantity).toFixed(2)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
