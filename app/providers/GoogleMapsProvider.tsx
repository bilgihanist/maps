'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LoadScript } from '@react-google-maps/api'

interface GoogleMapsContextType {
  isLoaded: boolean
  error: string | null
  retry: () => void
}

const GoogleMapsContext = createContext<GoogleMapsContextType | null>(null)

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRetry = () => {
    setIsLoaded(false)
    setError(null)
    window.location.reload()
  }

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (typeof window !== 'undefined' && window.google) {
        setIsLoaded(true)
        return true
      }
      return false
    }

    // İlk kontrol
    if (checkGoogleMaps()) {
      return
    }

    // Her 1 saniyede bir kontrol et
    const interval = setInterval(() => {
      if (checkGoogleMaps()) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div>
        Google Maps API anahtarı bulunamadı. Lütfen .env.local dosyasında NEXT_PUBLIC_GOOGLE_MAPS_API_KEY değişkenini ayarlayın.
      </div>
    )
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, error, retry: handleRetry }}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onLoad={() => {
          console.log('Google Maps API yüklendi')
          setIsLoaded(true)
        }}
        onError={(error) => {
          console.error('Google Maps API yüklenemedi:', error)
          setError('Harita yüklenemedi. Lütfen internet bağlantınızı kontrol edin.')
          setIsLoaded(false)
        }}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  )
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext)
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider')
  }
  return context
} 