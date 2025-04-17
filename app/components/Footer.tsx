'use client'

import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react'

export default function Footer() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      as="footer"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        py={3}
        align="center"
        justify="center"
      >
        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} Harita Uygulaması. Tüm hakları saklıdır.
        </Text>
      </Flex>
    </Box>
  )
} 