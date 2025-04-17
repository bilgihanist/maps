'use client'

import { Box } from '@chakra-ui/react'
import { Providers } from '../providers'
import { GoogleMapsProvider } from '../providers/GoogleMapsProvider'
import Header from './Header'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <GoogleMapsProvider>
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
            <Header />
            <Box
              as="main"
              pt="60px"
              pb="60px"
              minH="100vh"
            >
              {children}
            </Box>
            <Footer />
          </Box>
        </Box>
      </GoogleMapsProvider>
    </Providers>
  )
} 