"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const stations = [
  {
    name: "Port Moresby",
    frequency: "93.9 FM",
    position: [-9.4438, 147.1803] as [number, number],
  },
  {
    name: "Lae",
    frequency: "105.9 FM",
    position: [-6.7322, 146.9997] as [number, number],
  },
  {
    name: "Mount Hagen",
    frequency: "105.9 FM",
    position: [-5.8575, 144.2306] as [number, number],
  },
]

const pngBounds: [[number, number], [number, number]] = [
  [-12.5, 139.0], // southwest
  [-1.0, 160.5],  // northeast
]

export default function MapClient() {
  return (
    <MapContainer
      center={[-6.314993, 145.0]}
      zoom={6}
      minZoom={6}
      maxZoom={10}
      maxBounds={pngBounds}
      maxBoundsViscosity={1.0}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {stations.map((station) => (
        <Marker
          key={station.name}
          position={station.position}
          icon={markerIcon}
        >
          <Popup>
            <div>
              <h3 style={{ fontWeight: "bold" }}>{station.name}</h3>
              <p>{station.frequency}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}