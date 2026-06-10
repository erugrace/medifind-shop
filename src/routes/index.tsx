import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterPanel } from "@/components/marketplace/FilterPanel";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/marketplace/data";
import {
  DEFAULT_FILTERS,
  SORT_LABELS,
  applyFilters,
  countActiveFilters,
  type FilterState,
  type SortOption,
} from "@/lib/marketplace/filters";
import type { CategoryId } from "@/lib/marketplace/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediFind — Shop Medical & Health Equipment" },
      { name: "description", content: "Browse thousands of medical devices, mobility aids, supplements and recovery tools from verified sellers." },
      { property: "og:title", content: "MediFind — Shop Medical & Health Equipment" },
      { property: "og:description", content: "Browse medical devices, mobility aids, supplements and recovery tools from verified sellers." },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const products = useMemo(() => applyFilters(PRODUCTS, filters), [filters]);
  const activeCount = countActiveFilters(filters);

  const toggleCategory = (id: CategoryId) => {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(id) ? f.categories.filter((c) => c !== id) : [...f.categories, id],
    }));
  };

  return (
    <div className="flex">
      {/* Desktop filter rail */}
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 border-r bg-card lg:block">
        <FilterPanel filters={filters} onChange={setFilters} />
      </aside>

      <div className="min-w-0 flex-1">
        {/* Hero strip */}
        <div className="border-b bg-card px-4 py-6 md:px-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Medical equipment, found faster.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {PRODUCTS.length}+ products from verified medical suppliers, hospitals and official brand stores.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filters.categories.includes(c.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-accent"
                }`}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-14 z-10 flex flex-wrap items-center gap-2 border-b bg-background/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="relative min-w-0 flex-1 basis-56">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search products, brands, conditions…"
              className="bg-card pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="size-4" />
                Filters
                {activeCount > 0 && <Badge className="ml-1">{activeCount}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <FilterPanel filters={filters} onChange={setFilters} />
            </SheetContent>
          </Sheet>
          <Select value={filters.sort} onValueChange={(v) => setFilters((f) => ({ ...f, sort: v as SortOption }))}>
            <SelectTrigger className="w-44 bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-4 pt-3 md:px-8">
            {filters.categories.map((id) => {
              const c = CATEGORIES.find((x) => x.id === id)!;
              return (
                <Badge key={id} variant="secondary" className="gap-1">
                  {c.emoji} {c.name}
                  <button onClick={() => toggleCategory(id)} aria-label={`Remove ${c.name} filter`}>
                    <X className="size-3" />
                  </button>
                </Badge>
              );
            })}
            {filters.brands.map((b) => (
              <Badge key={b} variant="secondary" className="gap-1">
                {b}
                <button onClick={() => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) }))} aria-label={`Remove ${b} filter`}>
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground"
              onClick={() => setFilters((f) => ({ ...DEFAULT_FILTERS, search: f.search, sort: f.sort }))}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Results */}
        <div className="px-4 py-4 md:px-8">
          <p className="mb-3 text-xs text-muted-foreground">
            {products.length} result{products.length === 1 ? "" : "s"}
          </p>
          {products.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <p className="font-semibold">No products match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try removing some filters or broadening your search.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilters((f) => ({ ...DEFAULT_FILTERS, sort: f.sort }))}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
