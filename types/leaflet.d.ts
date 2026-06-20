declare module "leaflet" {
  export type LatLngTuple = [number, number]
  export type LatLngExpression = LatLngTuple | number[]
  export type LatLngBoundsExpression = [LatLngTuple, LatLngTuple]

  export type FitBoundsOptions = Record<string, unknown>

  export interface MapOptions {
    center?: LatLngExpression
    zoom?: number
    minZoom?: number
    maxZoom?: number
    maxBounds?: LatLngBoundsExpression
    maxBoundsViscosity?: number
    scrollWheelZoom?: boolean
  }

  export interface TileLayerOptions {
    attribution?: string
    opacity?: number
  }

  export interface IconOptions {
    iconUrl: string
    iconRetinaUrl?: string
    shadowUrl?: string
    iconSize?: [number, number]
    iconAnchor?: [number, number]
  }

  export class Icon {
    constructor(options: IconOptions)
  }

  export interface MarkerOptions {
    icon?: Icon
  }

  export class Map {}
  export class TileLayer {}
  export class Marker {}

  const L: {
    Icon: typeof Icon
  }

  export default L
}
