'use client'

import { Box, Container, Heading, Text, VStack, Button, useColorModeValue } from '@chakra-ui/react'
import { useLocationStore } from './store/useLocationStore'
import { useRouter } from 'next/navigation'

export default function Home() {
  const locations = useLocationStore((state) => state.locations)
  const router = useRouter()

  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="xl" mb={6}>
        Konum Yönetimi
      </Heading>

      <VStack spacing={6} align="stretch">
        <Box
          p={6}
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow="base"
        >
          <Text mb={4}>
            {locations.length > 0
              ? `${locations.length} konum bulunuyor.`
              : 'Henüz konum eklenmemiş.'}
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => router.push('/add-location')}
            width="full"
            mb={4}
          >
            Yeni Konum Ekle
          </Button>
          {locations.length > 0 && (
            <Button
              colorScheme="teal"
              onClick={() => router.push('/locations')}
              width="full"
            >
              Konumları Listele
            </Button>
          )}
        </Box>

        {locations.length > 0 && (
          <Button
            colorScheme="green"
            onClick={() => router.push('/route')}
            width="full"
          >
            Rotayı Görüntüle
          </Button>
        )}
      </VStack>
    </Container>
  )
}
