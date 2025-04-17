// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
}))

// Mock the Google Maps API
global.google = {
  maps: {
    Map: jest.fn(),
    Marker: jest.fn(),
    LatLng: jest.fn(),
    LatLngBounds: jest.fn(),
    places: {
      Autocomplete: jest.fn(),
    },
  },
} 