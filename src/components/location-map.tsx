import React, { useCallback, useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  MapMouseEvent,
  Marker,
} from "@vis.gl/react-google-maps";
import { AutocompletePlaces } from "./places-autocomplete";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface LatLng {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  setLocation?: (location: LatLng) => void;
  location?: LatLng;
  noSearch?: boolean;
}

function LocationMap({ setLocation, location, noSearch }: LocationMapProps) {
  const [address, setAddress] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(
    location || null
  );
  const [center, setCenter] = useState<LatLng | undefined>(
    currentLocation || undefined
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (!location) {
        const newLocation: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
        setCenter(newLocation);
      }
    });
  }, [location]);

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      if (event.detail.latLng) {
        const latLng = {
          lat: event.detail.latLng.lat,
          lng: event.detail.latLng.lng,
        };

        setLocation?.(latLng);
        setCurrentLocation(latLng);

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK") {
            if (results && results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              setAddress("No address found");
            }
          } else {
            setAddress("Error fetching address");
          }
        });
      }
    },
    [setLocation]
  );

  const handleCameraChange = useCallback(
    (ev: { detail: { center: LatLng } }) => setCenter(ev.detail.center),
    []
  );

  return (
    <APIProvider apiKey={apiKey as string}>
      {!noSearch && (
        <AutocompletePlaces
          setPlace={(place: { position: LatLng }) => {
            setCenter(place.position);
            setCurrentLocation(place.position);
          }}
        />
      )}

      <Map
        onCameraChanged={handleCameraChange}
        center={center}
        onClick={handleMapClick}
        style={{ width: "100%", height: "400px" }}
        defaultZoom={12}
      >
        {(currentLocation || location) && (
          <Marker position={currentLocation || location} />
        )}
        {address && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "white",
              padding: "10px",
            }}
          >
            {address}
          </div>
        )}
      </Map>
    </APIProvider>
  );
}

export default LocationMap;
