import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Location {
  id: string
  name: string
  lat: number
  lng: number
  color: string
}

interface LocationStore {
  locations: Location[]
  addLocation: (location: Omit<Location, 'id'>) => void
  updateLocation: (id: string, location: Partial<Location>) => void
  deleteLocation: (id: string) => void
  clearLocations: () => void
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      locations: [],
      addLocation: (location) =>
        set((state) => ({
          locations: [
            ...state.locations,
            { ...location, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      updateLocation: (id, location) =>
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...location } : loc
          ),
        })),
      deleteLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id),
        })),
      clearLocations: () => set({ locations: [] }),
    }),
    {
      name: 'location-storage',
    }
  )
) 