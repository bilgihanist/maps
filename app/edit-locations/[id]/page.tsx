'use client'

import { useEffect, useState } from 'react'
import { use } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'
import {
  Box,
  Container,
  Heading,
  useColorModeValue,
  Text,
  Spinner,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'
import { useLocationStore } from '../../store/useLocationStore'
import { useRouter } from 'next/navigation'
import { useGoogleMaps } from '../../providers/GoogleMapsProvider'

const containerStyle = {
  width: '100%',
  height: '400px',
}

interface LocationParams {
  id: string
}

export default function EditLocation({ params }: { params: Promise<LocationParams> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const toast = useToast()
  const { updateLocation, locations } = useLocationStore()
  const { isLoaded, error, retry } = useGoogleMaps()
  const [location, setLocation] = useState<{
    id: string
    name: string
    lat: number
    lng: number
    color: string
  } | null>(null)

  useEffect(() => {
    if (resolvedParams.id) {
      const currentLocation = locations.find((loc) => loc.id === resolvedParams.id)
      if (currentLocation) {
        setLocation(currentLocation)
      } else {
        router.push('/locations')
      }
    }
  }, [locations, resolvedParams.id, router])

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && location) {
      setLocation({
        ...location,
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location) {
      updateLocation(resolvedParams.id, {
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        color: location.color,
      })
      toast({
        title: 'Konum güncellendi',
        status: 'success',
        duration: 3000,
        isClosable: true,
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

  if (!location) {
    return (
      <Container maxW="container.xl" py={10}>
        <Spinner size="xl" />
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>
        Konumu Düzenle
      </Heading>

      <VStack spacing={6} align="stretch">
        {error && (
          <Box
            p={6}
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
          minH="400px"
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
              center={{ lat: location.lat, lng: location.lng }}
              zoom={15}
              onClick={handleMapClick}
            >
              <Marker
                position={{ lat: location.lat, lng: location.lng }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: location.color,
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#000000',
                }}
              />
            </GoogleMap>
          )}
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
                value={location.name}
                onChange={(e) =>
                  setLocation((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Renk</FormLabel>
              <Input
                type="color"
                value={location.color}
                onChange={(e) =>
                  setLocation((prev) =>
                    prev ? { ...prev, color: e.target.value } : null
                  )
                }
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full">
              Güncelle
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
} 