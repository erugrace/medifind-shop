/// <reference types="google.maps" />
import { useEffect, useRef } from "react";
import type { NearbyStore } from "@/lib/stores.functions";

declare global {
  interface Window {
    google?: typeof google;
    __medifindMapInit?: () => void;
  }
}

let mapsPromise: Promise<void> | null = null;

function loadMapsApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.Map) return Promise.resolve();
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise<void>((resolve, reject) => {
    window.__medifindMapInit = () => resolve();
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__medifindMapInit&channel=${channel}`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load map"));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

interface StoreMapProps {
  center: { lat: number; lng: number };
  stores: NearbyStore[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function StoreMap({ center, stores, selectedId, onSelect }: StoreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMapsApi().then(() => {
      if (cancelled || !containerRef.current) return;
      if (!mapRef.current) {
        mapRef.current = new google.maps.Map(containerRef.current, {
          center,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        infoRef.current = new google.maps.InfoWindow();
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center
  useEffect(() => {
    mapRef.current?.panTo(center);
  }, [center.lat, center.lng]);

  // Update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      // Map may not be ready yet; retry after load
      let cancelled = false;
      loadMapsApi().then(() => {
        if (!cancelled) renderMarkers();
      });
      return () => {
        cancelled = true;
      };
    }
    renderMarkers();

    function renderMarkers() {
      const m = mapRef.current;
      if (!m) return;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();

      if (stores.length === 0) return;
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(center);

      stores.forEach((store, i) => {
        const marker = new google.maps.Marker({
          map: m,
          position: { lat: store.lat, lng: store.lng },
          title: store.name,
          label: { text: String(i + 1), color: "#ffffff", fontSize: "12px", fontWeight: "700" },
        });
        marker.addListener("click", () => {
          onSelect?.(store.id);
          infoRef.current?.setContent(
            `<div style="font-family:sans-serif;max-width:220px"><strong>${store.name}</strong><br/><span style="font-size:12px">${store.address}</span></div>`,
          );
          infoRef.current?.open({ map: m, anchor: marker });
        });
        markersRef.current.set(store.id, marker);
        bounds.extend({ lat: store.lat, lng: store.lng });
      });
      m.fitBounds(bounds, 48);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stores]);

  // Highlight selection
  useEffect(() => {
    if (!selectedId) return;
    const marker = markersRef.current.get(selectedId);
    const map = mapRef.current;
    if (marker && map) {
      map.panTo(marker.getPosition()!);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => marker.setAnimation(null), 1400);
    }
  }, [selectedId]);

  return <div ref={containerRef} className="size-full min-h-[320px] rounded-xl bg-muted" aria-label="Map of nearby stores" />;
}
