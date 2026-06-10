import { useMemo, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ALL_BRANDS, CATEGORIES } from "@/lib/marketplace/data";
import { BUDGET_TIERS, DEFAULT_FILTERS, PRICE_MAX, countActiveFilters, type FilterState } from "@/lib/marketplace/filters";
import { CONDITION_LABELS, SELLER_TYPE_LABELS, type CategoryId, type Condition, type SellerType } from "@/lib/marketplace/types";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
}

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch });
  const activeCount = countActiveFilters(filters);

  const visibleBrands = useMemo(
    () => ALL_BRANDS.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase())),
    [brandSearch],
  );

  const ToggleRow = ({ label, value, patch }: { label: string; value: boolean; patch: Partial<FilterState> }) => (
    <div className="flex items-center justify-between py-1">
      <Label className="cursor-pointer text-sm font-normal" onClick={() => onChange({ ...filters, ...patch })}>
        {label}
      </Label>
      <Switch checked={value} onCheckedChange={() => onChange({ ...filters, ...patch })} />
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-bold">Filters {activeCount > 0 && <span className="text-primary">({activeCount})</span>}</h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onChange({ ...DEFAULT_FILTERS, search: filters.search, sort: filters.sort })}>
            Clear all
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        <Accordion type="multiple" defaultValue={["price", "category", "deals"]}>
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-semibold">Price</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="px-1 pt-2">
                <Slider
                  min={0}
                  max={PRICE_MAX}
                  step={5}
                  value={filters.priceRange}
                  onValueChange={(v) => set({ priceRange: [v[0], v[1]] as [number, number] })}
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}{filters.priceRange[1] === PRICE_MAX ? "+" : ""}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {BUDGET_TIERS.map((t) => (
                  <label key={t.id} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.budgetTiers.includes(t.id)}
                      onCheckedChange={() => set({ budgetTiers: toggleIn(filters.budgetTiers, t.id) })}
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="category">
            <AccordionTrigger className="text-sm font-semibold">Categories</AccordionTrigger>
            <AccordionContent className="space-y-2">
              {CATEGORIES.map((c) => (
                <div key={c.id}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.categories.includes(c.id)}
                      onCheckedChange={() => set({ categories: toggleIn(filters.categories, c.id as CategoryId) })}
                    />
                    <span>{c.emoji} {c.name}</span>
                  </label>
                  {filters.categories.includes(c.id) && (
                    <div className="ml-7 mt-1.5 space-y-1.5">
                      {c.subcategories.map((s) => (
                        <label key={s} className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                          <Checkbox
                            checked={filters.subcategories.includes(s)}
                            onCheckedChange={() => set({ subcategories: toggleIn(filters.subcategories, s) })}
                          />
                          {s}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="brands">
            <AccordionTrigger className="text-sm font-semibold">Brands</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Input
                placeholder="Search brands…"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="h-8 text-sm"
              />
              <ToggleRow label="Top brands only" value={filters.topBrandsOnly} patch={{ topBrandsOnly: !filters.topBrandsOnly }} />
              <div className="max-h-48 space-y-1.5 overflow-y-auto">
                {visibleBrands.map((b) => (
                  <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox checked={filters.brands.includes(b)} onCheckedChange={() => set({ brands: toggleIn(filters.brands, b) })} />
                    {b}
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="deals">
            <AccordionTrigger className="text-sm font-semibold">Deals & Discounts</AccordionTrigger>
            <AccordionContent>
              <ToggleRow label="On sale" value={filters.onSale} patch={{ onSale: !filters.onSale }} />
              <div className="space-y-1.5 py-1">
                <p className="text-xs font-medium text-muted-foreground">Minimum discount</p>
                {([10, 25, 50] as const).map((d) => (
                  <label key={d} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={filters.discountTier === d}
                      onCheckedChange={() => set({ discountTier: filters.discountTier === d ? 0 : d })}
                    />
                    {d}%+ off
                  </label>
                ))}
              </div>
              <ToggleRow label="Clearance" value={filters.clearance} patch={{ clearance: !filters.clearance }} />
              <ToggleRow label="Bundle deals" value={filters.bundles} patch={{ bundles: !filters.bundles }} />
              <ToggleRow label="Free shipping" value={filters.freeShipping} patch={{ freeShipping: !filters.freeShipping }} />
              <ToggleRow label="Limited time offers" value={filters.limitedTime} patch={{ limitedTime: !filters.limitedTime }} />
              <ToggleRow label="Bulk / wholesale pricing" value={filters.bulkPricing} patch={{ bulkPricing: !filters.bulkPricing }} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ratings">
            <AccordionTrigger className="text-sm font-semibold">Ratings</AccordionTrigger>
            <AccordionContent className="space-y-1.5">
              {([3, 4, 4.5] as const).map((r) => (
                <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={filters.minRating === r} onCheckedChange={() => set({ minRating: filters.minRating === r ? 0 : r })} />
                  {r}★ & above
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="availability">
            <AccordionTrigger className="text-sm font-semibold">Availability</AccordionTrigger>
            <AccordionContent>
              <ToggleRow label="In stock only" value={filters.inStockOnly} patch={{ inStockOnly: !filters.inStockOnly }} />
              <ToggleRow label="Ships within 24 hrs" value={filters.shipsIn24h} patch={{ shipsIn24h: !filters.shipsIn24h }} />
              <ToggleRow label="Local pickup" value={filters.localPickup} patch={{ localPickup: !filters.localPickup }} />
              <ToggleRow label="In nearby physical stores" value={filters.nearbyStores} patch={{ nearbyStores: !filters.nearbyStores }} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="seller">
            <AccordionTrigger className="text-sm font-semibold">Seller</AccordionTrigger>
            <AccordionContent className="space-y-1.5">
              {(Object.keys(SELLER_TYPE_LABELS) as SellerType[]).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.sellerTypes.includes(t)}
                    onCheckedChange={() => set({ sellerTypes: toggleIn(filters.sellerTypes, t) })}
                  />
                  {SELLER_TYPE_LABELS[t]}
                </label>
              ))}
              <ToggleRow label="Verified sellers only" value={filters.verifiedSellersOnly} patch={{ verifiedSellersOnly: !filters.verifiedSellersOnly }} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="condition">
            <AccordionTrigger className="text-sm font-semibold">Condition</AccordionTrigger>
            <AccordionContent className="space-y-1.5">
              {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={filters.conditions.includes(c)}
                    onCheckedChange={() => set({ conditions: toggleIn(filters.conditions, c) })}
                  />
                  {CONDITION_LABELS[c]}
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
