'use client'

import { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Text,
} from '@chakra-ui/react'
import { useLocationStore } from '../store/useLocationStore'

const containerStyle = {
  width: '100%',
  height: '600px',
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places']

export default function Route() {
  const locations = useLocationStore((state) => state.locations)
  const [sortedLocations, setSortedLocations] = useState(locations)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Konum alınamadı:', error)
        }
      )
    }
  }, [])

  useEffect(() => {
    if (userLocation && locations.length > 0) {
      const sorted = [...locations].sort((a, b) => {
        const distanceA = Math.sqrt(
          Math.pow(a.lat - userLocation.lat, 2) +
            Math.pow(a.lng - userLocation.lng, 2)
        )
        const distanceB = Math.sqrt(
          Math.pow(b.lat - userLocation.lat, 2) +
            Math.pow(b.lng - userLocation.lng, 2)
        )
        return distanceA - distanceB
      })
      setSortedLocations(sorted)
    }
  }, [locations, userLocation])

  const path = sortedLocations.map((location) => ({
    lat: location.lat,
    lng: location.lng,
  }))

  const center = userLocation || {
    lat: 41.0082,
    lng: 28.9784,
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <Container maxW="container.xl" py={10}>
        <Text color="red.500">
          Google Maps API anahtarı bulunamadı. Lütfen .env.local dosyasında NEXT_PUBLIC_GOOGLE_MAPS_API_KEY değişkenini ayarlayın.
        </Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>
        Rota
      </Heading>

      <Box
        borderRadius="lg"
        overflow="hidden"
        boxShadow="base"
        bg={useColorModeValue('white', 'gray.700')}
      >
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
          onLoad={() => setIsLoaded(true)}
        >
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
            >
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#4285F4',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#000000',
                  }}
                />
              )}
              {sortedLocations.map((location, index) => (
                <Marker
                  key={index}
                  position={{ lat: location.lat, lng: location.lng }}
                  label={(index + 1).toString()}
                />
              ))}
              {path.length > 1 && (
                <Polyline
                  path={path}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              )}
            </GoogleMap>
          )}
        </LoadScript>
      </Box>
    </Container>
  )
} 