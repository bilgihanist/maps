'use client'

import { useState } from 'react'
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
import { useLocationStore } from '../store/useLocationStore'
import { useRouter } from 'next/navigation'
import { useGoogleMaps } from '../providers/GoogleMapsProvider'

const containerStyle = {
  width: '100%',
  height: '400px',
}

const defaultCenter = {
  lat: 41.0082,
  lng: 28.9784,
}

export default function AddLocation() {
  const router = useRouter()
  const toast = useToast()
  const { addLocation } = useLocationStore()
  const { isLoaded, error, retry } = useGoogleMaps()
  const [location, setLocation] = useState<{
    name: string
    lat: number | null
    lng: number | null
    color: string
  }>({
    name: '',
    lat: null,
    lng: null,
    color: '#FF0000',
  })

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation((prev) => ({
        ...prev,
        lat: e.latLng!.lat(),
        lng: e.latLng!.lng(),
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.name && location.color && location.lat && location.lng) {
      addLocation({
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        color: location.color,
      })
      toast({
        title: 'Konum eklendi',
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

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>
        Yeni Konum Ekle
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
              center={defaultCenter}
              zoom={10}
              onClick={handleMapClick}
            >
              {location.lat && location.lng && (
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
              )}
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
                  setLocation((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Renk</FormLabel>
              <Input
                type="color"
                value={location.color}
                onChange={(e) =>
                  setLocation((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="blue" 
              width="full"
              isDisabled={!location.lat || !location.lng}
            >
              Ekle
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
} 