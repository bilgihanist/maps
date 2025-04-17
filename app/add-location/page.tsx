'use client'

import { useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorModeValue,
  Heading,
  Container,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useLocationStore } from '../store/useLocationStore'
import { useRouter } from 'next/navigation'

const containerStyle = {
  width: '100%',
  height: '400px',
}

const center = {
  lat: 41.0082,
  lng: 28.9784,
}

export default function AddLocation() {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#FF0000')
  const [isLoaded, setIsLoaded] = useState(false)
  const addLocation = useLocationStore((state) => state.addLocation)
  const router = useRouter()

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedLocation && name) {
      addLocation({
        name,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        color,
      })
      router.push('/locations')
    }
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
        Yeni Konum Ekle
      </Heading>

      <VStack spacing={6} align="stretch">
        <Box
          borderRadius="lg"
          overflow="hidden"
          boxShadow="base"
          bg={useColorModeValue('white', 'gray.700')}
          position="relative"
        >
          {!isLoaded && (
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              zIndex={1}
            >
              <Spinner size="xl" color="blue.500" />
            </Box>
          )}
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            onLoad={() => setIsLoaded(true)}
          >
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onClick={handleMapClick}
              >
                {selectedLocation && (
                  <Marker
                    position={selectedLocation}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: color,
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: '#000000',
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </LoadScript>
        </Box>

        <Box
          as="form"
          onSubmit={handleSubmit}
          p={6}
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="base"
        >
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Konum Adı</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Konum adını girin"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Renk</FormLabel>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              isDisabled={!selectedLocation || !name}
              width="full"
            >
              Konumu Kaydet
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
} 