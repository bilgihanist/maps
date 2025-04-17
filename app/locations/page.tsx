'use client'

import { useState, useRef } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  IconButton,
  Flex,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons'
import { useLocationStore } from '../store/useLocationStore'
import { useRouter } from 'next/navigation'

export default function Locations() {
  const locations = useLocationStore((state) => state.locations)
  const deleteLocation = useLocationStore((state) => state.deleteLocation)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const router = useRouter()

  const handleDelete = (id: string) => {
    setLocationToDelete(id)
    onOpen()
  }

  const confirmDelete = () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete)
      setLocationToDelete(null)
      onClose()
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" color={'white'}>
          Konumlar
        </Heading>
        <Button
          colorScheme="blue"
          onClick={() => router.push('/route')}
        >
          Rota Göster
        </Button>
      </Flex>

      <Box as="ul" listStyleType="none" p={0}>
        {locations.map((location) => (
          <Box
            as="li"
            key={location.id}
            p={4}
            borderRadius="lg"
            bg="white"
            boxShadow="base"
            mb={3}
          >
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={4}>
                <Box
                  w="20px"
                  h="20px"
                  borderRadius="full"
                  bg={location.color}
                  border="2px solid"
                  borderColor="gray.200"
                />
                <VStack align="start">
                  <Text fontWeight="bold">{location.name}</Text>
                  {selectedLocation === location.id && (
                    <Text fontSize="sm" color="gray.500">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </Text>
                  )}
                </VStack>
              </Flex>
              <Flex gap={2}>
                <Button
                  onClick={() => router.push(`/edit-locations/${location.id}`)}
                  variant="ghost"
                >
                  Düzenle
                </Button>
                <IconButton
                  aria-label="Konumu sil"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleDelete(location.id)}
                />
              </Flex>
            </Flex>
          </Box>
        ))}
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Konumu Sil
            </AlertDialogHeader>

            <AlertDialogBody>
              Bu konumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                İptal
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Sil
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
} 