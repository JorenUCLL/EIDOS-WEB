import mapboxgl, { LngLatLike } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

export function useMap(defaultCenter: LngLatLike) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const mapLoaded = useRef(false);
  const [coords, setCoords] = useState<LngLatLike | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const resolveAddress = async (coords: LngLatLike): Promise<string> => {
    try {
      const [lng, lat] = coords as [number, number];
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const data = await res.json();
      return data.features?.[0]?.place_name ?? "Unknown address";
    } catch {
      return "Unknown address";
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const { latitude, longitude } = coords;
        setCoords([longitude, latitude]);
        const foundAddress = await resolveAddress([longitude, latitude]);
        setAddress(foundAddress);
      });
    }
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: defaultCenter,
      zoom: 13,
    });

    map.current.on("load", () => {
      mapLoaded.current = true;
    });

    return () => {
      mapLoaded.current = false;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!coords || !map.current) return;

    const applyMarker = () => {
      marker.current?.remove();
      marker.current = new mapboxgl.Marker()
        .setLngLat(coords)
        .addTo(map.current!);
      map.current!.flyTo({ center: coords, zoom: 13 });
    };

    if (mapLoaded.current) {
      applyMarker();
    } else {
      map.current.once("load", applyMarker);
    }
  }, [coords]);

  return { mapContainer, coords, address };
}