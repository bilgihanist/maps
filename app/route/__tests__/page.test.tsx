import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useLocationStore } from '../../../store/useLocationStore'
import Route from '../page'

// Mock the store
jest.mock('../../../store/useLocationStore', () => ({
  useLocationStore: jest.fn(),
}))

// Mock the Google Maps API
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: () => <div data-testid="google-map">Google Map</div>,
  Marker: () => <div data-testid="marker">Marker</div>,
  InfoWindow: () => <div data-testid="info-window">Info Window</div>,
  useLoadScript: () => ({
    isLoaded: true,
    loadError: null,
  }),
}))

describe('Route Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    
    // Mock the store implementation
    ;(useLocationStore as unknown as jest.Mock).mockImplementation(() => ({
      locations: [
        { id: '1', name: 'Location 1', lat: 41.0082, lng: 28.9784, color: '#FF0000' },
        { id: '2', name: 'Location 2', lat: 41.0082, lng: 28.9784, color: '#00FF00' },
      ],
    }))
  })

  it('renders without crashing', () => {
    render(<Route />)
    expect(screen.getByText('Konumlar')).toBeInTheDocument()
  })

  it('displays error message when geolocation fails', () => {
    // Mock geolocation error
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success, error) => 
        error({ code: 1, message: 'User denied geolocation' })
      ),
    }
    
    // @ts-ignore - Overriding read-only property for testing
    global.navigator.geolocation = mockGeolocation

    render(<Route />)
    expect(screen.getByText('Konum bilgisi alınamadı')).toBeInTheDocument()
  })
}) 