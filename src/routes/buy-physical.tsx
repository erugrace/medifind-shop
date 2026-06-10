import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Crosshair, ExternalLink, Loader2, MapPin, Phone, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StoreMap } from "@/components/buy-physical/StoreMap";
import { searchNearbyStores, geocodeAddress, type NearbyStore } from "@/lib/stores.functions";

export const Route = createFileRoute("/buy-physical")({
  head: () => ({
    meta: [
      { title: "Buy Physical — Find Nearby Stores — MediFind" },
      { name: "description", content: "Find nearby pharmacies and medical supply stores that stock the equipment you need." },
      { property: "og:title", content: "Buy Physical — Find Nearby Stores — MediFind" },
      { property: "og:description", content: "Find nearby pharmacies and medical supply stores with an embedded map." },
    ],
  }),
  component: BuyPhysicalPage,
});

const QUICK_SEARCHES = ["Medical supply store", "Pharmacy", "Mobility equipment", "Home health care store"];

function BuyPhysicalPage() {
  const searchFn = useServerFn(searchNearbyStores);
  const geocodeFn = useServerFn(geocodeAddress);

  const [what, setWhat] = useState("Medical supply store");
  const [where, setWhere] = useState("");
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const runSearch = async (query: string, lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchFn({ data: { query, lat, lng } });
      if (result.error) {
        setError(result.error);
        setStores([]);
      } else {
        setStores(result.stores);
        setSelectedId(null);
      }
      setSearched(true);
    } catch {
      setError("Something went wrong searching for stores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (queryOverride?: string) => {
    const query = (queryOverride ?? what).trim();
    if (!query) {
      setError("Tell us what you're looking for, e.g. 'wheelchair' or 'pharmacy'.");
      return;
    }
    setError(null);

    let point = center;
    if (where.trim()) {
      setLoading(true);
      try {
        const geo = await geocodeFn({ data: { address: where.trim() } });
        if ("error" in geo) {
          setError(geo.error);
          setLoading(false);
          return;
        }
        point = { lat: geo.lat, lng: geo.lng };
        setCenter(point);
        setLocationLabel(geo.label);
      } catch {
        setError("Could not look up that location. Please try again.");
        setLoading(false);
        return;
      }
    }

    if (!point) {
      setError("Enter a city or address, or use your current location.");
      setLoading(false);
      return;
    }
    await runSearch(query, point.lat, point.lng);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location access. Enter a city instead.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(point);
        setLocationLabel("Your current location");
        setWhere("");
        setLocating(false);
        await runSearch(what.trim() || "Medical supply store", point.lat, point.lng);
      },
      () => {
        setLocating(false);
        setError("Couldn't access your location. Enter a city or address instead.");
      },
      { timeout: 10000 },
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Buy Physical
        </h1>
        <p className="mt-1 text-muted-foreground">
          Find pharmacies and medical supply stores near you, so you can pick up equipment today.
        </p>
      </header>

      {/* Search controls */}
      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={what}
            onChange={(e) => setWhat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="What do you need? e.g. wheelchair, CPAP supplies"
            className="pl-9"
            aria-label="What are you looking for"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={locationLabel ?? "City or address"}
            className="pl-9"
            aria-label="Where to search"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleSearch()} disabled={loading || locating}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            Search
          </Button>
          <Button variant="outline" onClick={useMyLocation} disabled={loading || locating} title="Use my location">
            {locating ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
            <span className="hidden sm:inline">Near me</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {QUICK_SEARCHES.map((q) => (
          <Badge
            key={q}
            variant={what === q ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => {
              setWhat(q);
              if (center) void handleSearch(q);
            }}
          >
            {q}
          </Badge>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {center ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Results list */}
          <div className="order-2 max-h-[560px] space-y-3 overflow-y-auto pr-1 lg:order-1">
            {locationLabel && (
              <p className="text-xs text-muted-foreground">
                Showing results near <span className="font-medium text-foreground">{locationLabel}</span>
              </p>
            )}
            {loading && (
              <div className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Searching stores…
              </div>
            )}
            {!loading && searched && stores.length === 0 && !error && (
              <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
                No stores found nearby. Try a broader search like "pharmacy" or widen your location.
              </div>
            )}
            {stores.map((store, i) => (
              <button
                key={store.id}
                type="button"
                onClick={() => setSelectedId(store.id)}
                className={`w-full rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/50 ${
                  selectedId === store.id ? "border-primary ring-1 ring-primary/30" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      {store.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{store.address}</p>
                  </div>
                  {store.openNow !== undefined && (
                    <Badge variant={store.openNow ? "default" : "secondary"} className="shrink-0">
                      {store.openNow ? "Open" : "Closed"}
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {store.rating !== undefined && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-warning text-warning" />
                      {store.rating.toFixed(1)}
                      {store.ratingCount ? <span className="text-xs">({store.ratingCount})</span> : null}
                    </span>
                  )}
                  {store.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="size-3.5" /> {store.phone}
                    </span>
                  )}
                  {store.mapsUri && (
                    <a
                      href={store.mapsUri}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="size-3.5" /> Directions
                    </a>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="order-1 h-[320px] overflow-hidden rounded-xl border lg:order-2 lg:h-[560px]">
            <StoreMap center={center} stores={stores} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 px-6 py-16 text-center">
          <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="size-7" />
          </span>
          <h2 className="font-display text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Where should we look?
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Enter a city or address above, or use your current location to see nearby pharmacies and medical supply
            stores on the map.
          </p>
          <Button className="mt-5" onClick={useMyLocation} disabled={locating}>
            {locating ? <Loader2 className="size-4 animate-spin" /> : <Crosshair className="size-4" />}
            Use my location
          </Button>
        </div>
      )}
    </div>
  );
}
