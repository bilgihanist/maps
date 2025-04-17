'use client'

import { Inter } from 'next/font/google'
import { Providers } from './providers'
import Header from './components/Header'
import Footer from './components/Footer'
import './globals.css'
import { Box } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          <Header />
          <Box
            as="main"
            pt="60px" // Header yüksekliği
            pb="60px" // Footer yüksekliği
            minH="100vh"
          >
            {children}
          </Box>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
