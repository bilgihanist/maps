'use client'

import { Box, Container, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, useColorModeValue, Text, Icon, Card, CardBody, Flex, Divider } from '@chakra-ui/react';
import { FaPlane, FaWalking, FaCar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useLocationStore } from './store/useLocationStore';
import Link from 'next/link';
import { BsGeoAlt } from "react-icons/bs";
import { FaRoute } from "react-icons/fa";
import { useEffect } from 'react';
import { AddIcon, ViewIcon, TimeIcon, StarIcon } from "@chakra-ui/icons";

const calculateTotalDistance = (locations: any[]) => {
  if (locations.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < locations.length - 1; i++) {
    const loc1 = locations[i];
    const loc2 = locations[i + 1];
    
    // Haversine formülü ile iki nokta arası mesafe hesaplama
    const R = 6371; // Dünya'nın yarıçapı (km)
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    totalDistance += distance;
  }
  
  return Math.round(totalDistance);
};

const getDistanceIcon = (distance: number) => {
  if (distance > 1000) return FaPlane;
  if (distance > 100) return FaCar;
  return FaWalking;
};

const getDistanceText = (distance: number) => {
  if (distance > 1000) return 'Uçakla seyahat edilebilecek mesafe';
  if (distance > 100) return 'Araçla seyahat edilebilecek mesafe';
  return 'Yürüyerek kat edilebilecek mesafe';
};

export default function Home() {
  // Store'dan locations'ı doğrudan alıyoruz
  const locations = useLocationStore((state) => state.locations);
  const totalLocations = locations.length;
  const recentLocations = locations.slice(-3);
  const totalDistance = calculateTotalDistance(locations);
  const DistanceIcon = getDistanceIcon(totalDistance);

  // Store'daki değişiklikleri izliyoruz
  useEffect(() => {
    const unsubscribe = useLocationStore.subscribe((state) => {
      console.log('Locations updated in Home:', state.locations);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container maxW="container.xl" py={10}>
      <Card>
        <CardBody>
          <Heading size="lg" mb={6} textAlign="center">Konum Yönetimi Dashboard</Heading>
          
          {/* İstatistik Kartı */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            <Card bg="blue.50">
              <CardBody>
                <Stat>
                  <StatLabel fontSize="lg" mb={2} display="flex" alignItems="center">
                    <Icon as={FaMapMarkerAlt} mr={2} color="blue.500" />
                    Toplam Konum
                  </StatLabel>
                  <StatNumber fontSize="4xl" fontWeight="bold" color="blue.500">
                    {totalLocations}
                  </StatNumber>
                  <Text mt={2} color="gray.600">Kayıtlı konumlarınız</Text>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="green.50">
              <CardBody>
                <Stat>
                  <StatLabel fontSize="lg" mb={2} display="flex" alignItems="center">
                    <Icon as={DistanceIcon} mr={2} color="green.500" />
                    Toplam Mesafe
                  </StatLabel>
                  <StatNumber fontSize="4xl" fontWeight="bold" color="green.500">
                    {totalDistance} km
                  </StatNumber>
                  <Text mt={2} color="gray.600">{getDistanceText(totalDistance)}</Text>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          <Divider mb={8} />

          {/* Ana İşlem Kartları */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {/* Yeni Konum Ekle Kartı */}
            <Link href="/add-location" style={{ textDecoration: "none" }}>
              <Card 
                _hover={{ 
                  transform: "translateY(-5px)", 
                  transition: "all 0.2s ease-in-out",
                  shadow: "lg"
                }}
                cursor="pointer"
              >
                <CardBody>
                  <Flex direction="column" align="center" justify="center" height="100%">
                    <Icon as={AddIcon} w={8} h={8} color="green.500" mb={3} />
                    <Text fontSize="xl" fontWeight="bold">Yeni Konum Ekle</Text>
                    <Text mt={2} color="gray.600" textAlign="center">
                      Yeni bir konum eklemek için tıklayın
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            </Link>

            {/* Konumları Göster Kartı */}
            <Link href="/locations" style={{ textDecoration: "none" }}>
              <Card 
                _hover={{ 
                  transform: "translateY(-5px)", 
                  transition: "all 0.2s ease-in-out",
                  shadow: "lg"
                }}
                cursor="pointer"
              >
                <CardBody>
                  <Flex direction="column" align="center" justify="center" height="100%">
                    <Icon as={BsGeoAlt} w={8} h={8} color="purple.500" mb={3} />
                    <Text fontSize="xl" fontWeight="bold">Konumları Göster</Text>
                    <Text mt={2} color="gray.600" textAlign="center">
                      Tüm konumlarınızı görüntüleyin
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            </Link>

            {/* Rotaları Göster Kartı */}
            <Link href="/route" style={{ textDecoration: "none" }}>
              <Card 
                _hover={{ 
                  transform: "translateY(-5px)", 
                  transition: "all 0.2s ease-in-out",
                  shadow: "lg"
                }}
                cursor="pointer"
              >
                <CardBody>
                  <Flex direction="column" align="center" justify="center" height="100%">
                    <Icon as={FaRoute} w={8} h={8} color="orange.500" mb={3} />
                    <Text fontSize="xl" fontWeight="bold">Rotaları Göster</Text>
                    <Text mt={2} color="gray.600" textAlign="center">
                      En uygun rotayı hesaplayın
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            </Link>
          </SimpleGrid>

          {/* Son Eklenen Konumlar */}
          {recentLocations.length > 0 && (
            <>
              <Divider my={8} />
              <Heading size="md" mb={4}>Son Eklenen Konumlar</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {recentLocations.map((location) => (
                  <Card key={location.id} size="sm">
                    <CardBody>
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text fontWeight="bold">{location.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                          </Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  )
}
