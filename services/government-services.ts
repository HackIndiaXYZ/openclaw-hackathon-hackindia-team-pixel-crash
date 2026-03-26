"use client"

import { useState, useEffect } from "react"
import governmentServicesData from "@/data/government-services.json"

export interface GovernmentService {
  id: string
  name: string
  description: string
  type: "scheme" | "app" | "portal" | "service"
  category: string
  url: string
  isActive: boolean
  features: string[]
  isFeatured?: boolean
}

export interface ServiceCategory {
  id: string
  name: string
  icon: string
}

export interface StateServices {
  name: string
  services: GovernmentService[]
}

export interface GovernmentServicesData {
  states: Record<string, StateServices>
  national: GovernmentService[]
  categories: ServiceCategory[]
}

// Indian states list for dropdown
export const INDIAN_STATES = [
  { code: "andhra-pradesh", name: "Andhra Pradesh" },
  { code: "arunachal-pradesh", name: "Arunachal Pradesh" },
  { code: "assam", name: "Assam" },
  { code: "bihar", name: "Bihar" },
  { code: "chhattisgarh", name: "Chhattisgarh" },
  { code: "goa", name: "Goa" },
  { code: "gujarat", name: "Gujarat" },
  { code: "haryana", name: "Haryana" },
  { code: "himachal-pradesh", name: "Himachal Pradesh" },
  { code: "jharkhand", name: "Jharkhand" },
  { code: "karnataka", name: "Karnataka" },
  { code: "kerala", name: "Kerala" },
  { code: "madhya-pradesh", name: "Madhya Pradesh" },
  { code: "maharashtra", name: "Maharashtra" },
  { code: "manipur", name: "Manipur" },
  { code: "meghalaya", name: "Meghalaya" },
  { code: "mizoram", name: "Mizoram" },
  { code: "nagaland", name: "Nagaland" },
  { code: "odisha", name: "Odisha" },
  { code: "punjab", name: "Punjab" },
  { code: "rajasthan", name: "Rajasthan" },
  { code: "sikkim", name: "Sikkim" },
  { code: "tamil-nadu", name: "Tamil Nadu" },
  { code: "telangana", name: "Telangana" },
  { code: "tripura", name: "Tripura" },
  { code: "uttar-pradesh", name: "Uttar Pradesh" },
  { code: "uttarakhand", name: "Uttarakhand" },
  { code: "west-bengal", name: "West Bengal" },
]

export const useGovernmentServices = () => {
  const [data] = useState<GovernmentServicesData>(governmentServicesData as GovernmentServicesData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getServicesByState = (stateCode: string): GovernmentService[] => {
    const stateData = data.states[stateCode]
    return stateData ? stateData.services : []
  }

  const getNationalServices = (): GovernmentService[] => {
    return data.national
  }

  const getFeaturedServices = (): GovernmentService[] => {
    return data.national.filter((service) => service.isFeatured)
  }

  const getServicesByCategory = (category: string, stateCode?: string): GovernmentService[] => {
    let services: GovernmentService[] = [...data.national]

    if (stateCode) {
      const stateServices = getServicesByState(stateCode)
      services = [...services, ...stateServices]
    }

    if (category === "all") {
      return services
    }

    return services.filter((service) => service.category === category)
  }

  const searchServices = (query: string, stateCode?: string): GovernmentService[] => {
    let services: GovernmentService[] = [...data.national]

    if (stateCode) {
      const stateServices = getServicesByState(stateCode)
      services = [...services, ...stateServices]
    }

    if (!query.trim()) {
      return services
    }

    const searchTerm = query.toLowerCase()
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        service.features.some((feature) => feature.toLowerCase().includes(searchTerm)),
    )
  }

  const getCategories = (): ServiceCategory[] => {
    return data.categories
  }

  const checkServiceAvailability = async (url: string): Promise<boolean> => {
    try {
      // In a real implementation, you would make a HEAD request to check if the URL is accessible
      // For demo purposes, we'll simulate some services being unavailable
      const unavailableServices = ["https://example-broken-link.gov.in", "https://unavailable-service.gov.in"]

      return !unavailableServices.includes(url)
    } catch {
      return false
    }
  }

  return {
    data,
    loading,
    error,
    getServicesByState,
    getNationalServices,
    getFeaturedServices,
    getServicesByCategory,
    searchServices,
    getCategories,
    checkServiceAvailability,
  }
}

// Hook for geolocation-based state detection
export const useGeolocation = () => {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
    state?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // In a real implementation, you would use a reverse geocoding service
          // For demo purposes, we'll simulate state detection based on coordinates
          const detectedState = await detectStateFromCoordinates(latitude, longitude)

          setLocation({
            latitude,
            longitude,
            state: detectedState,
          })
        } catch (err) {
          setError("Failed to detect state from location")
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError(`Location detection failed: ${err.message}`)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const detectStateFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    // Simplified state detection based on approximate coordinates
    // In a real app, you would use a proper reverse geocoding service

    if (lat >= 28.4 && lat <= 30.2 && lng >= 76.8 && lng <= 77.5) {
      return "delhi"
    } else if (lat >= 18.8 && lat <= 19.3 && lng >= 72.7 && lng <= 73.2) {
      return "maharashtra"
    } else if (lat >= 12.8 && lat <= 13.2 && lng >= 77.4 && lng <= 77.8) {
      return "karnataka"
    } else if (lat >= 30.2 && lat <= 31.8 && lng >= 75.8 && lng <= 76.8) {
      return "punjab"
    } else if (lat >= 26.4 && lat <= 27.2 && lng >= 80.8 && lng <= 81.2) {
      return "uttar-pradesh"
    }

    // Default fallback
    return "delhi"
  }

  useEffect(() => {
    // Auto-detect location on component mount
    detectLocation()
  }, [])

  return {
    location,
    loading,
    error,
    detectLocation,
  }
}
