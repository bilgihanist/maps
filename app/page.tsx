'use client'

import { Box, Container, Heading, SimpleGrid, Text, VStack, HStack, Icon, useColorModeValue, Button } from '@chakra-ui/react'
import { useLocationStore } from './store/useLocationStore'
import { AddIcon, ViewIcon, InfoIcon, RepeatIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { FaMapMarkedAlt } from 'react-icons/fa'

export default function Home() {
  const { locations } = useLocationStore()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const stats = [
    {
      title: 'Toplam Konum',
      value: locations.length,
      icon: InfoIcon,
      color: 'blue.500',
    },
    {
      title: 'Toplam Rota',
      value: locations.length > 1 ? locations.length - 1 : 0,
      icon: RepeatIcon,
      color: 'green.500',
    },
  ]

  const actions = [
    {
      title: 'Yeni Konum Ekle',
      description: 'Haritadan yeni bir konum seçin',
      icon: AddIcon,
      href: '/add-location',
      color: 'purple.500',
    },
    {
      title: 'Konumları Görüntüle',
      description: 'Tüm konumlarınızı listeleyin',
      icon: ViewIcon,
      href: '/locations',
      color: 'orange.500',
    },
  ]

  return (
    <Box
      minH="100vh"
      bgImage="url('/map-bg.jpg')"
      bgSize="cover"
      bgPosition="center"
      bgAttachment="fixed"
    >
      <Box
        minH="100vh"
        bg="blackAlpha.600"
        backdropFilter="blur(10px)"
      >
        <Container maxW="container.xl" py={10}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center" color="white">
              <Heading size="2xl" mb={2}>Seyahat Takip</Heading>
              <Text fontSize="xl" opacity={0.8}>
                Konumlarınızı takip edin, rotalarınızı planlayın
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {stats.map((stat) => (
                <Box
                  key={stat.title}
                  p={6}
                  bg={bgColor}
                  borderRadius="xl"
                  boxShadow="lg"
                  border="1px"
                  borderColor={borderColor}
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                >
                  <HStack spacing={4}>
                    <Box
                      p={3}
                      bg={`${stat.color}Alpha.100`}
                      borderRadius="lg"
                    >
                      <Icon as={stat.icon} w={6} h={6} color={stat.color} />
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" color="gray.500">
                        {stat.title}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold">
                        {stat.value}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {actions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Box
                    p={6}
                    bg={bgColor}
                    borderRadius="xl"
                    boxShadow="lg"
                    border="1px"
                    borderColor={borderColor}
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl',
                      bg: hoverBg,
                    }}
                    cursor="pointer"
                  >
                    <HStack spacing={4}>
                      <Box
                        p={3}
                        bg={`${action.color}Alpha.100`}
                        borderRadius="lg"
                      >
                        <Icon as={action.icon} w={6} h={6} color={action.color} />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">
                          {action.title}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {action.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                </Link>
              ))}
            </SimpleGrid>

            <Box textAlign="center">
              <Link href="/route">
                <Button
                  size="lg"
                  colorScheme="orange"
                  leftIcon={<FaMapMarkedAlt size="20px" />}
                  height="60px"
                  px={8}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="full"
                  boxShadow="lg"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  _active={{
                    transform: 'translateY(1px)',
                  }}
                >
                  Rotaları Göster
                </Button>
              </Link>
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
