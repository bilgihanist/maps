'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLocationStore } from '../store/useLocationStore'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Card,
  CardBody,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

export default function Locations() {
  const router = useRouter()
  const toast = useToast()
  const { locations, deleteLocation } = useLocationStore()
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  const cardBg = useColorModeValue('white', 'gray.800')

  const handleDelete = async (id: string) => {
    try {
      await deleteLocation(id)
      toast({
        title: 'Başarılı',
        description: 'Konum başarıyla silindi',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Konum silinirken bir hata oluştu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const openDeleteDialog = (id: string) => {
    setLocationToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setLocationToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const confirmDelete = () => {
    if (locationToDelete) {
      handleDelete(locationToDelete)
      closeDeleteDialog()
    }
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" color={'white'} mb={2}>Konumlar</Heading>
          <Text color="white">Tüm konumlarınızı buradan yönetebilirsiniz</Text>
        </Box>

        <Button
          leftIcon={<FaPlus />}
          colorScheme="blue"
          size="lg"
          onClick={() => router.push('/add-location')}
        >
          Yeni Konum Ekle
        </Button>

        {locations.length === 0 ? (
          <Card bg={cardBg} borderRadius="xl" boxShadow="xl">
            <CardBody textAlign="center" py={10}>
              <Text color="gray.500" fontSize="lg">
                Henüz hiç konum eklenmemiş
              </Text>
            </CardBody>
          </Card>
        ) : (
          <VStack spacing={4} align="stretch">
            {locations.map((location) => (
              <Card
                key={location.id}
                bg={cardBg}
                borderRadius="xl"
                boxShadow="xl"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
              >
                <CardBody>
                  <HStack justify="space-between" align="center">
                    <Box>
                      <Heading size="md" mb={1}>
                        {location.name}
                      </Heading>
                      <Text color="gray.500" fontSize="sm">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </Text>
                    </Box>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Düzenle"
                        icon={<FaEdit />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => router.push(`/edit-locations/${location.id}`)}
                      />
                      <IconButton
                        aria-label="Sil"
                        icon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => openDeleteDialog(location.id)}
                      />
                    </HStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
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
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
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