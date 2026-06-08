import mapboxgl, { LngLatLike } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

export function useMap(defaultCenter: LngLatLike) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [coords, setCoords] = useState<LngLatLike | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setCoords([longitude, latitude]);
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

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!coords || !map.current) return;

    marker.current?.remove();
    marker.current = new mapboxgl.Marker()
      .setLngLat(coords)
      .addTo(map.current);

    map.current.flyTo({ center: coords, zoom: 13 });
  }, [coords]);

  return { mapContainer, coords };
}