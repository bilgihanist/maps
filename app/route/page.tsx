'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api'
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Text,
  Spinner,
  Button,
  VStack,
  useToast,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useLocationStore } from '../store/useLocationStore'
import { useGoogleMaps } from '../providers/GoogleMapsProvider'
import { calculateDistance } from '../utils/distance'
import { Location } from '../store/useLocationStore'

// Location tipine distance özelliği ekleyen genişletilmiş tip
interface LocationWithDistance extends Location {
  distance: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
}

export default function Route() {
  const { locations } = useLocationStore()
  const { isLoaded, error, retry } = useGoogleMaps()
  const toast = useToast()
  const mapHeight = useBreakpointValue({ base: '300px', md: '400px', lg: '500px' })
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [sortedLocations, setSortedLocations] = useState<LocationWithDistance[]>([])
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [selectedLocation, setSelectedLocation] = useState<{
    id: string
    name: string
    lat: number
    lng: number
    color: string
    distance: number
  } | null>(null)

  // Kullanıcı konumunu al
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
          toast({
            title: 'Konum alınamadı',
            description: 'Lütfen konum izni verdiğinizden emin olun.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      )
    }
  }, [toast])

  // Konum seçme işleyicisi
  const handleLocationClick = useCallback((location: LocationWithDistance) => {
    setSelectedLocation({
      id: location.id,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
      color: location.color || '#FF0000',
      distance: location.distance
    })
  }, [])

  // Konumları sırala ve mesafeleri hesapla
  useEffect(() => {
    if (userLocation && locations.length > 0) {
      // Kullanıcının konumundan her bir noktaya olan mesafeyi hesapla
      const distances = locations.map(loc => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          loc.lat,
          loc.lng
        );
        return {
          ...loc,
          color: loc.color || '#FF0000',
          distance
        } as LocationWithDistance;
      });

      // En yakın noktadan başlayarak sırala
      const sorted = [...distances].sort((a, b) => a.distance - b.distance)
      setSortedLocations(sorted)

      // Toplam mesafeyi hesapla
      let total = 0
      for (let i = 0; i < sorted.length - 1; i++) {
        total += calculateDistance(
          sorted[i].lat,
          sorted[i].lng,
          sorted[i + 1].lat,
          sorted[i + 1].lng
        )
      }
      setTotalDistance(total)
    }
  }, [locations, userLocation])

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
    <Container maxW="container.xl" py={4}>
      <Heading as="h1" size="xl" color={'white'} mb={4}>
        Rota
      </Heading>

      <VStack spacing={4} align="stretch">
        {error && (
          <Box
            p={4}
            borderRadius="lg"
            bg={useColorModeValue('red.50', 'red.900')}
            textAlign="center"
            boxShadow="md"
          >
            <Text color="red.500" fontSize="lg" fontWeight="bold" mb={4}>
              {error}
            </Text>
            <Button 
              colorScheme="red" 
              size="lg" 
              onClick={retry}
              leftIcon={<Spinner size="sm" />}
            >
              Haritayı Yeniden Yükle
            </Button>
          </Box>
        )}

        <Box
          borderRadius="lg"
          overflow="hidden"
          boxShadow="base"
          bg={useColorModeValue('white', 'gray.700')}
          position="relative"
          height={mapHeight}
        >
          {!isLoaded && !error && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={1}
              textAlign="center"
            >
              <Spinner size="xl" color="blue.500" mb={4} />
              <Text fontSize="lg" fontWeight="medium">Harita yükleniyor...</Text>
            </Box>
          )}

          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation || { lat: 41.0082, lng: 28.9784 }}
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
                  label={{
                    text: 'Siz',
                    color: '#FFFFFF',
                  }}
                />
              )}

              {sortedLocations.map((location, index) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: location.color || '#FF0000',
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#000000',
                  }}
                  label={{
                    text: `${index + 1}`,
                    color: '#FFFFFF',
                  }}
                  onClick={() => handleLocationClick(location)}
                />
              ))}

              {selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setSelectedLocation(null)}
                >
                  <Box p={2}>
                    <Text fontWeight="bold">{selectedLocation.name}</Text>
                    <Text fontSize="sm" color="gray.500">
                      Konumunuzdan uzaklık: {selectedLocation.distance.toFixed(2)} km
                    </Text>
                  </Box>
                </InfoWindow>
              )}

              {sortedLocations.length > 0 && (
                <Polyline
                  path={[
                    userLocation || { lat: 41.0082, lng: 28.9784 },
                    ...sortedLocations.map(loc => ({ lat: loc.lat, lng: loc.lng }))
                  ]}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              )}
            </GoogleMap>
          )}
        </Box>

        <Box
          p={4}
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="base"
        >
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="medium">
              Toplam Rota Mesafesi: {totalDistance.toFixed(2)} km
            </Text>
            <Text fontSize="md" color="gray.500">
              Konumlar, sizin konumunuza olan uzaklığa göre sıralanmıştır.
            </Text>
            {selectedLocation && (
              <Text fontSize="md" color="blue.500">
                Seçili Konum: {selectedLocation.name} ({selectedLocation.distance.toFixed(2)} km)
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
} 