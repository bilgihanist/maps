'use client'

import { Box, Flex, IconButton, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'
import { FaHome } from 'react-icons/fa'

export default function Header() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        h="60px"
        px={4}
        align="center"
        justify="space-between"
      >
        <Link href="/">
          <IconButton
            aria-label="Ana sayfaya dön"
            icon={<FaHome />}
            variant="ghost"
            colorScheme="blue"
            size="lg"
          />
        </Link>
        <Box
          fontSize="xl"
          fontWeight="bold"
          color="blue.500"
        >
          Harita Uygulaması
        </Box>
        <Box w="48px" /> 
      </Flex>
    </Box>
  )
} 