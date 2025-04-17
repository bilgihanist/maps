import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Location {
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
  getLocations: () => Location[]
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      locations: [],
      addLocation: (location) => {
        const newLocation = {
          ...location,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          locations: [...state.locations, newLocation],
        }));
        return newLocation;
      },
      updateLocation: (id, location) => {
        set((state) => ({
          locations: state.locations.map((loc) =>
            loc.id === id ? { ...loc, ...location } : loc
          ),
        }));
      },
      deleteLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((loc) => loc.id !== id),
        }));
      },
      clearLocations: () => set({ locations: [] }),
      getLocations: () => get().locations,
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        console.log('Store hydration completed', state);
      },
    }
  )
)

// Store'daki değişiklikleri dinlemek için subscribe
useLocationStore.subscribe((state) => {
  console.log('Store updated:', state);
}); 