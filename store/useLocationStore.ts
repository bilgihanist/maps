import { create } from 'zustand'

export interface Location {
  id: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  color: string
}

interface LocationStore {
  locations: Location[]
  addLocation: (location: Omit<Location, 'id'>) => void
  updateLocation: (id: string, location: Omit<Location, 'id'>) => void
  deleteLocation: (id: string) => void
}

export const useLocationStore = create<LocationStore>((set) => ({
  locations: [],
  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, { ...location, id: Date.now().toString() }],
    })),
  updateLocation: (id, location) =>
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === id ? { ...location, id } : loc
      ),
    })),
  deleteLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== id),
    })),
})) 