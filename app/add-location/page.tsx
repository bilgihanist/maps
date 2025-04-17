'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useLocationStore } from '../store/useLocationStore'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaMapMarkerAlt, FaTag } from 'react-icons/fa'
import { useGoogleMaps } from '../providers/GoogleMapsProvider'

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
}

const center = {
  lat: 41.0082,
  lng: 28.9784,
}

export default function AddLocation() {
  const router = useRouter()
  const toast = useToast()
  const { addLocation } = useLocationStore()
  const { isLoaded, error } = useGoogleMaps()
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#FF0000')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.800')

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLocation || !name || !color) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm alanları doldurun',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)
    try {
      await addLocation({
        name,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        color,
      })
      toast({
        title: 'Başarılı',
        description: 'Konum başarıyla eklendi',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/')
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Konum eklenirken bir hata oluştu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <Container maxW="container.md" py={8}>
        <Alert status="error" borderRadius="xl">
          <AlertIcon />
          <Box>
            <AlertTitle>API Anahtarı Hatası</AlertTitle>
            <AlertDescription>
              Google Maps API anahtarı bulunamadı. Lütfen .env.local dosyasında NEXT_PUBLIC_GOOGLE_MAPS_API_KEY değişkenini ayarlayın.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card
        bg={cardBg}
        borderRadius="xl"
        boxShadow="xl"
        overflow="hidden"
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
      >
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" mb={2}>Yeni Konum Ekle</Heading>
              <Text color="black">Haritadan bir konum seçin ve detaylarını girin</Text>
            </Box>

            {error ? (
              <Alert status="error" borderRadius="xl">
                <AlertIcon />
                <Box>
                  <AlertTitle>Harita Hatası</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
                <Button
                  ml="auto"
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => window.location.reload()}
                >
                  Yeniden Dene
                </Button>
              </Alert>
            ) : !isLoaded ? (
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="md"
                transition="all 0.2s"
                _hover={{ boxShadow: 'lg' }}
                position="relative"
                height="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Spinner size="xl" color="blue.500" />
              </Box>
            ) : (
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="md"
                transition="all 0.2s"
                _hover={{ boxShadow: 'lg' }}
                position="relative"
              >
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={13}
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
                        strokeColor: 'white',
                        strokeWeight: 2,
                      }}
                    />
                  )}
                </GoogleMap>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Konum Adı</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaMapMarkerAlt color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Konum adını girin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>İşaretçi Rengi</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaTag color="gray.300" />
                    </InputLeftElement>
                    <Input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      p={1}
                      h="40px"
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={isSubmitting}
                  loadingText="Ekleniyor..."
                  isDisabled={!selectedLocation || !isLoaded || !!error}
                >
                  Konumu Ekle
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
} 