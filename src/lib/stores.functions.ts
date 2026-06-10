import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

const SearchInput = z.object({
  query: z.string().min(1).max(200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const GeocodeInput = z.object({
  address: z.string().min(2).max(300),
});

export interface NearbyStore {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  ratingCount?: number;
  openNow?: boolean;
  phone?: string;
  mapsUri?: string;
}

function requireKeys() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const mapsKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!lovableKey || !mapsKey) {
    throw new Error("Maps service is not configured on the server.");
  }
  return { lovableKey, mapsKey };
}

export const searchNearbyStores = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SearchInput.parse(input))
  .handler(async ({ data }): Promise<{ stores: NearbyStore[]; error?: string }> => {
    const { lovableKey, mapsKey } = requireKeys();

    const res = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": mapsKey,
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.currentOpeningHours.openNow,places.nationalPhoneNumber,places.googleMapsUri",
      },
      body: JSON.stringify({
        textQuery: data.query,
        maxResultCount: 12,
        locationBias: {
          circle: {
            center: { latitude: data.lat, longitude: data.lng },
            radius: 20000,
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Places search failed: ${res.status} ${body}`);
      return { stores: [], error: "Store search is temporarily unavailable. Please try again." };
    }

    const json = (await res.json()) as {
      places?: Array<{
        id: string;
        displayName?: { text?: string };
        formattedAddress?: string;
        location?: { latitude: number; longitude: number };
        rating?: number;
        userRatingCount?: number;
        currentOpeningHours?: { openNow?: boolean };
        nationalPhoneNumber?: string;
        googleMapsUri?: string;
      }>;
    };

    const stores: NearbyStore[] = (json.places ?? [])
      .filter((p) => p.location)
      .map((p) => ({
        id: p.id,
        name: p.displayName?.text ?? "Unnamed store",
        address: p.formattedAddress ?? "",
        lat: p.location!.latitude,
        lng: p.location!.longitude,
        rating: p.rating,
        ratingCount: p.userRatingCount,
        openNow: p.currentOpeningHours?.openNow,
        phone: p.nationalPhoneNumber,
        mapsUri: p.googleMapsUri,
      }));

    return { stores };
  });

export const geocodeAddress = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GeocodeInput.parse(input))
  .handler(async ({ data }): Promise<{ lat: number; lng: number; label: string } | { error: string }> => {
    const { lovableKey, mapsKey } = requireKeys();

    const res = await fetch(
      `${GATEWAY_URL}/maps/api/geocode/json?address=${encodeURIComponent(data.address)}`,
      {
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": mapsKey,
        },
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Geocode failed: ${res.status} ${body}`);
      return { error: "Could not look up that location. Please try again." };
    }

    const json = (await res.json()) as {
      status: string;
      results?: Array<{ formatted_address: string; geometry: { location: { lat: number; lng: number } } }>;
    };

    const first = json.results?.[0];
    if (json.status !== "OK" || !first) {
      return { error: "No results found for that location. Try a city name or full address." };
    }

    return {
      lat: first.geometry.location.lat,
      lng: first.geometry.location.lng,
      label: first.formatted_address,
    };
  });
