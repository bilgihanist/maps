'use client'

import { Box, Container, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, useColorModeValue, Text, Icon, Card, CardBody, Flex, Divider } from '@chakra-ui/react';
import { FaPlane, FaWalking, FaCar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useLocationStore } from './store/useLocationStore';
import Link from 'next/link';
import { BsGeoAlt } from "react-icons/bs";
import { FaRoute } from "react-icons/fa";
import { useEffect, useMemo } from 'react';
import { AddIcon, ViewIcon, TimeIcon, StarIcon } from "@chakra-ui/icons";
import { calculateTotalDistance, getDistanceIcon, getDistanceText } from './utils/distance';
import { Location } from './store/useLocationStore';

export default function Home() {
  // Store'dan locations'ı doğrudan alıyoruz
  const locations = useLocationStore((state) => state.locations);
  const totalLocations = locations.length;
  
  // Son eklenen konumları al
  const recentLocations = useMemo(() => locations.slice(-3), [locations]);
  
  // Toplam mesafeyi hesapla
  const totalDistance = useMemo(() => calculateTotalDistance(locations), [locations]);
  
  // Mesafe ikonunu belirle
  const distanceIconType = useMemo(() => getDistanceIcon(totalDistance), [totalDistance]);
  
  // Mesafe ikonunu seç
  const DistanceIcon = useMemo(() => {
    switch (distanceIconType) {
      case 'plane': return FaPlane;
      case 'car': return FaCar;
      default: return FaWalking;
    }
  }, [distanceIconType]);

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
  );
}
