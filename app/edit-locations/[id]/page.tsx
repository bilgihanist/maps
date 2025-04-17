'use client'

import { useState, useEffect } from 'react'
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
import { useLocationStore } from '../../store/useLocationStore'
import { useRouter } from 'next/navigation'

const containerStyle = {
  width: '100%',
  height: '400px',
}

export default function EditLocation({ params }: { params: { id: string } }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#FF0000')
  const [location, setLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const locations = useLocationStore((state) => state.locations)
  const updateLocation = useLocationStore((state) => state.updateLocation)
  const router = useRouter()

  useEffect(() => {
    const currentLocation = locations.find((loc) => loc.id === params.id)
    if (currentLocation) {
      setName(currentLocation.name)
      setColor(currentLocation.color)
      setLocation({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      })
    } else {
      router.push('/locations')
    }
  }, [locations, params.id, router])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location && name) {
      updateLocation(params.id, {
        name,
        lat: location.lat,
        lng: location.lng,
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
        Konumu Düzenle
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
            {isLoaded && location && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={15}
                onClick={handleMapClick}
              >
                <Marker
                  position={location}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: color,
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#000000',
                  }}
                />
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
              isDisabled={!location || !name}
              width="full"
            >
              Değişiklikleri Kaydet
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
} 