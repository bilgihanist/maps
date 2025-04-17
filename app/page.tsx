'use client'

import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <Heading as="h1" size="2xl" textAlign="center" mb={10}>
        Harita Uygulaması
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        <Link href="/add-location">
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ bg: 'gray.50', cursor: 'pointer' }}
          >
            <Heading as="h2" size="md" mb={2}>
              Konum Ekle
            </Heading>
            <Text>Haritadan yeni konum ekleyin</Text>
          </Box>
        </Link>

        <Link href="/locations">
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ bg: 'gray.50', cursor: 'pointer' }}
          >
            <Heading as="h2" size="md" mb={2}>
              Konumları Listele
            </Heading>
            <Text>Kaydedilmiş konumları görüntüleyin</Text>
          </Box>
        </Link>

        <Link href="/edit-locations">
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ bg: 'gray.50', cursor: 'pointer' }}
          >
            <Heading as="h2" size="md" mb={2}>
              Konumları Düzenle
            </Heading>
            <Text>Konum bilgilerini güncelleyin</Text>
          </Box>
        </Link>

        <Link href="/route">
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ bg: 'gray.50', cursor: 'pointer' }}
          >
            <Heading as="h2" size="md" mb={2}>
              Rota Oluştur
            </Heading>
            <Text>Konumlar arası rota planlayın</Text>
          </Box>
        </Link>
      </SimpleGrid>
    </Container>
  )
}
