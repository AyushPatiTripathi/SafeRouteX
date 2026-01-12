import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"

import { useRoute } from "../context/RouteContext"

// Default map center (Jammu & Kashmir)
const DEFAULT_CENTER = [34.08, 74.8]
const DEFAULT_ZOOM = 7

export default function MapView() {
  const { routeData, safehouses } = useRoute()

  // For route animation
  const [step, setStep] = useState(0)

  // Animate route drawing when routeData changes
  useEffect(() => {
    if (!routeData?.coordinates) return

    setStep(0)
    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= routeData.coordinates.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 80)

    return () => clearInterval(interval)
  }, [routeData])

  const animatedCoords =
    routeData?.coordinates?.slice(0, Math.max(1, step)) || []

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      scrollWheelZoom
    >
      {/* Base map */}
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Evacuation route */}
      {animatedCoords.length > 1 && (
        <Polyline
          positions={animatedCoords}
          color="#16a34a" // Tailwind green-600
          weight={5}
          opacity={0.9}
        />
      )}

      {/* Route waypoints */}
      {routeData?.coordinates?.map((pos, idx) => (
        <Marker key={`wp-${idx}`} position={pos}>
          <Popup>
            <b>Waypoint {idx + 1}</b>
            <br />
            Lat: {pos[0].toFixed(4)}
            <br />
            Lon: {pos[1].toFixed(4)}
          </Popup>
        </Marker>
      ))}

      {/* Safehouse markers */}
      {safehouses?.map((sh, idx) => (
        <CircleMarker
          key={`sh-${idx}`}
          center={[sh.lat, sh.lon]}
          radius={7}
          pathOptions={{
            color: "#ef4444", // red-500
            fillColor: "#ef4444",
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <b>{sh.name}</b>
            <br />
            Type: {sh.type || "Unknown"}
            <br />
            Distance: {sh.distance_km} km
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}

