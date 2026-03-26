"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// Types for weather data
export type WeatherData = {
  location: {
    name: string
    country: string
    region?: string
    lat?: number
    lon?: number
  }
  current: {
    temp_c: number
    temp_f: number
    feelslike_c: number
    feelslike_f: number
    humidity: number
    wind_kph: number
    wind_mph: number
    wind_dir?: string
    pressure_mb?: number
    precip_mm?: number
    cloud?: number
    uv: number
    condition: {
      text: string
      icon: string
      code?: number
    }
    last_updated?: string
    is_day?: number
  }
  forecast?: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        avgtemp_c: number
        maxwind_kph?: number
        totalprecip_mm?: number
        daily_chance_of_rain?: number
        condition: {
          text: string
          icon: string
          code?: number
        }
      }
      hour: Array<{
        time: string
        temp_c: number
        humidity: number
        wind_kph?: number
        precip_mm?: number
        chance_of_rain?: number
        condition: {
          text: string
          icon: string
          code?: number
        }
        is_day?: number
      }>
      astro?: {
        sunrise: string
        sunset: string
        moonrise: string
        moonset: string
        moon_phase: string
      }
    }>
  }
  lastUpdated?: string
}

// Mock data for demonstration
const mockWeatherData: WeatherData = {
  location: {
    name: "New Delhi",
    country: "India",
    region: "Delhi",
    lat: 28.61,
    lon: 77.21,
  },
  current: {
    temp_c: 32,
    temp_f: 89.6,
    feelslike_c: 34,
    feelslike_f: 93.2,
    humidity: 55,
    wind_kph: 15,
    wind_mph: 9.3,
    wind_dir: "NW",
    pressure_mb: 1008,
    precip_mm: 0,
    cloud: 25,
    uv: 8,
    condition: {
      text: "Partly cloudy",
      icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
      code: 1003,
    },
    last_updated: "2025-04-07 14:30",
    is_day: 1,
  },
  forecast: {
    forecastday: [
      {
        date: "2025-04-07",
        day: {
          maxtemp_c: 34,
          mintemp_c: 24,
          avgtemp_c: 29,
          maxwind_kph: 18.4,
          totalprecip_mm: 0.2,
          daily_chance_of_rain: 20,
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
            code: 1003,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2025-04-07 ${String(i).padStart(2, "0")}:00`,
            temp_c: 24 + Math.sin((i / 24) * Math.PI * 2) * 10,
            humidity: 55 + Math.sin((i / 24) * Math.PI * 2) * 15,
            wind_kph: 12 + Math.sin((i / 24) * Math.PI * 2) * 6,
            precip_mm: i > 14 && i < 18 ? 0.2 : 0,
            chance_of_rain: i > 14 && i < 18 ? 20 : 0,
            condition: {
              text: i > 6 && i < 18 ? "Partly cloudy" : "Clear",
              icon:
                i > 6 && i < 18
                  ? "//cdn.weatherapi.com/weather/64x64/day/116.png"
                  : "//cdn.weatherapi.com/weather/64x64/night/113.png",
              code: i > 6 && i < 18 ? 1003 : 1000,
            },
            is_day: i > 6 && i < 18 ? 1 : 0,
          })),
        astro: {
          sunrise: "06:15 AM",
          sunset: "06:45 PM",
          moonrise: "09:20 PM",
          moonset: "07:30 AM",
          moon_phase: "Waxing Gibbous",
        },
      },
      {
        date: "2025-04-08",
        day: {
          maxtemp_c: 35,
          mintemp_c: 25,
          avgtemp_c: 30,
          maxwind_kph: 20.5,
          totalprecip_mm: 0,
          daily_chance_of_rain: 0,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
            code: 1000,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2025-04-08 ${String(i).padStart(2, "0")}:00`,
            temp_c: 25 + Math.sin((i / 24) * Math.PI * 2) * 10,
            humidity: 50 + Math.sin((i / 24) * Math.PI * 2) * 10,
            wind_kph: 14 + Math.sin((i / 24) * Math.PI * 2) * 6.5,
            precip_mm: 0,
            chance_of_rain: 0,
            condition: {
              text: i > 6 && i < 18 ? "Sunny" : "Clear",
              icon:
                i > 6 && i < 18
                  ? "//cdn.weatherapi.com/weather/64x64/day/113.png"
                  : "//cdn.weatherapi.com/weather/64x64/night/113.png",
              code: 1000,
            },
            is_day: i > 6 && i < 18 ? 1 : 0,
          })),
        astro: {
          sunrise: "06:14 AM",
          sunset: "06:46 PM",
          moonrise: "10:15 PM",
          moonset: "08:20 AM",
          moon_phase: "Waxing Gibbous",
        },
      },
      {
        date: "2025-04-09",
        day: {
          maxtemp_c: 36,
          mintemp_c: 26,
          avgtemp_c: 31,
          maxwind_kph: 16.2,
          totalprecip_mm: 1.5,
          daily_chance_of_rain: 60,
          condition: {
            text: "Patchy rain possible",
            icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
            code: 1063,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2025-04-09 ${String(i).padStart(2, "0")}:00`,
            temp_c: 26 + Math.sin((i / 24) * Math.PI * 2) * 10,
            humidity: 65 + Math.sin((i / 24) * Math.PI * 2) * 15,
            wind_kph: 10 + Math.sin((i / 24) * Math.PI * 2) * 6,
            precip_mm: i > 12 && i < 20 ? 0.3 : 0,
            chance_of_rain: i > 12 && i < 20 ? 60 : 10,
            condition: {
              text: i > 12 && i < 20 ? "Patchy rain possible" : i > 6 && i < 18 ? "Partly cloudy" : "Clear",
              icon:
                i > 12 && i < 20
                  ? "//cdn.weatherapi.com/weather/64x64/day/176.png"
                  : i > 6 && i < 18
                    ? "//cdn.weatherapi.com/weather/64x64/day/116.png"
                    : "//cdn.weatherapi.com/weather/64x64/night/113.png",
              code: i > 12 && i < 20 ? 1063 : i > 6 && i < 18 ? 1003 : 1000,
            },
            is_day: i > 6 && i < 18 ? 1 : 0,
          })),
        astro: {
          sunrise: "06:13 AM",
          sunset: "06:47 PM",
          moonrise: "11:10 PM",
          moonset: "09:05 AM",
          moon_phase: "Waxing Gibbous",
        },
      },
      {
        date: "2025-04-10",
        day: {
          maxtemp_c: 33,
          mintemp_c: 25,
          avgtemp_c: 29,
          maxwind_kph: 22.3,
          totalprecip_mm: 2.8,
          daily_chance_of_rain: 70,
          condition: {
            text: "Moderate rain",
            icon: "//cdn.weatherapi.com/weather/64x64/day/302.png",
            code: 1189,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2025-04-10 ${String(i).padStart(2, "0")}:00`,
            temp_c: 25 + Math.sin((i / 24) * Math.PI * 2) * 8,
            humidity: 75 + Math.sin((i / 24) * Math.PI * 2) * 15,
            wind_kph: 15 + Math.sin((i / 24) * Math.PI * 2) * 7,
            precip_mm: i > 10 && i < 22 ? 0.4 : 0,
            chance_of_rain: i > 10 && i < 22 ? 70 : 20,
            condition: {
              text: i > 10 && i < 22 ? "Moderate rain" : i > 6 && i < 18 ? "Cloudy" : "Partly cloudy",
              icon:
                i > 10 && i < 22
                  ? "//cdn.weatherapi.com/weather/64x64/day/302.png"
                  : i > 6 && i < 18
                    ? "//cdn.weatherapi.com/weather/64x64/day/119.png"
                    : "//cdn.weatherapi.com/weather/64x64/night/116.png",
              code: i > 10 && i < 22 ? 1189 : i > 6 && i < 18 ? 1006 : 1003,
            },
            is_day: i > 6 && i < 18 ? 1 : 0,
          })),
        astro: {
          sunrise: "06:12 AM",
          sunset: "06:48 PM",
          moonrise: "11:55 PM",
          moonset: "09:50 AM",
          moon_phase: "Full Moon",
        },
      },
      {
        date: "2025-04-11",
        day: {
          maxtemp_c: 30,
          mintemp_c: 24,
          avgtemp_c: 27,
          maxwind_kph: 18.7,
          totalprecip_mm: 0.5,
          daily_chance_of_rain: 40,
          condition: {
            text: "Patchy rain possible",
            icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
            code: 1063,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2025-04-11 ${String(i).padStart(2, "0")}:00`,
            temp_c: 24 + Math.sin((i / 24) * Math.PI * 2) * 6,
            humidity: 70 + Math.sin((i / 24) * Math.PI * 2) * 10,
            wind_kph: 12 + Math.sin((i / 24) * Math.PI * 2) * 6,
            precip_mm: i > 14 && i < 18 ? 0.2 : 0,
            chance_of_rain: i > 14 && i < 18 ? 40 : 10,
            condition: {
              text: i > 14 && i < 18 ? "Patchy rain possible" : i > 6 && i < 18 ? "Partly cloudy" : "Clear",
              icon:
                i > 14 && i < 18
                  ? "//cdn.weatherapi.com/weather/64x64/day/176.png"
                  : i > 6 && i < 18
                    ? "//cdn.weatherapi.com/weather/64x64/day/116.png"
                    : "//cdn.weatherapi.com/weather/64x64/night/113.png",
              code: i > 14 && i < 18 ? 1063 : i > 6 && i < 18 ? 1003 : 1000,
            },
            is_day: i > 6 && i < 18 ? 1 : 0,
          })),
        astro: {
          sunrise: "06:11 AM",
          sunset: "06:49 PM",
          moonrise: "00:40 AM",
          moonset: "10:35 AM",
          moon_phase: "Full Moon",
        },
      },
      {
        date: "2025-04-12",
        day: {
          maxtemp_c: 32,
          mintemp_c: 23,
          avgtemp_c: 28,
          maxwind_kph: 14.4,
          totalprecip_mm: 0,
          daily_chance_of_rain: 0,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
            code: 1000,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2025-04-12 ${String(i).padStart(2, "0")}:00`,
            temp_c: 23 + Math.sin((i / 24) * Math.PI * 2) * 9,
            humidity: 60 + Math.sin((i / 24) * Math.PI * 2) * 10,
            wind_kph: 10 + Math.sin((i / 24) * Math.PI * 2) * 4,
            precip_mm: 0,
            chance_of_rain: 0,
            condition: {
              text: i > 6 && i < 18 ? "Sunny" : "Clear",
              icon:
                i > 6 && i < 18
                  ? "//cdn.weatherapi.com/weather/64x64/day/113.png"
                  : "//cdn.weatherapi.com/weather/64x64/night/113.png",
              code: 1000,
            },
            is_day: i > 6 && i < 18 ? 1 : 0,
          })),
        astro: {
          sunrise: "06:10 AM",
          sunset: "06:50 PM",
          moonrise: "01:25 AM",
          moonset: "11:20 AM",
          moon_phase: "Waning Gibbous",
        },
      },
      {
        date: "2025-04-13",
        day: {
          maxtemp_c: 33,
          mintemp_c: 24,
          avgtemp_c: 29,
          maxwind_kph: 16.2,
          totalprecip_mm: 0,
          daily_chance_of_rain: 0,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png",
            code: 1000,
          },
        },
        hour: Array(24)
          .fill(null)
          .map((_, i) => ({
            time: `2025-04-13 ${String(i).padStart(2, "0")}:00`,
            temp_c: 24 + Math.sin((i / 24) * Math.PI * 2) * 9,
            humidity: 55 + Math.sin((i / 24) * Math.PI * 2) * 10,
            wind_kph: 12 + Math.sin((i / 24) * Math.PI * 2) * 4,
            precip_mm: 0,
            chance_of_rain: 0,
            condition: {
              text: i > 6 && i < 18 ? "Sunny" : "Clear",
              icon:
                i > 6 && i < 18
                  ? "//cdn.weatherapi.com/weather/64x64/day/113.png"
                  : "//cdn.weatherapi.com/weather/64x64/night/113.png",
              code: 1000,
            },
            is_day: i > 6 && i < 18 ? 1 : 0,
          })),
        astro: {
          sunrise: "06:09 AM",
          sunset: "06:51 PM",
          moonrise: "02:10 AM",
          moonset: "12:05 PM",
          moon_phase: "Waning Gibbous",
        },
      },
    ],
  },
  lastUpdated: new Date().toLocaleString(),
}

// Function to get weather data (current/forecast)
export const useWeatherData = (location = "New Delhi") => {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const updatedData: WeatherData = {
        ...mockWeatherData,
        location: {
          ...mockWeatherData.location,
          name: location.split(",")[0].trim(),
          country: location.includes(",") ? location.split(",")[1].trim() : "India",
        },
        lastUpdated: new Date().toLocaleString(),
      }
      setData(updatedData)
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Recommendations based on weather
export const getFarmingRecommendations = (data: WeatherData | null) => {
  if (!data) return null

  const { current, forecast } = data
  const today = forecast?.forecastday[0]
  const tomorrow = forecast?.forecastday[1]
  const nextWeek = forecast?.forecastday.slice(0, 7)

  // Irrigation
  let irrigation = {
    status: "Normal",
    message: "Normal conditions. Regular irrigation recommended.",
    icon: "droplet",
  } as const

  if (current.humidity < 40) {
    irrigation = {
      status: "Dry",
      message: "Dry conditions. Full irrigation recommended for all crops.",
      icon: "droplet-off",
    }
  } else if (current.humidity > 80) {
    irrigation = {
      status: "Wet",
      message: "Wet conditions. Reduce irrigation to prevent waterlogging.",
      icon: "droplet-half",
    }
  }

  // Field work suitability
  let fieldWork = {
    status: "Good",
    message: "Good conditions for field work and planting operations.",
    icon: "tractor",
  } as const

  if (current.humidity > 85 || (today && (today.day.totalprecip_mm ?? 0) > 5)) {
    fieldWork = {
      status: "Poor",
      message: "Wet soil conditions. Delay field operations until soil dries.",
      icon: "ban",
    }
  } else if (current.wind_kph > 20) {
    fieldWork = {
      status: "Caution",
      message: "High winds may affect spraying and some field operations.",
      icon: "alert-triangle",
    }
  }

  const cropConditions = [
    {
      name: "Wheat optimal conditions",
      status:
        current.temp_c > 15 && current.temp_c < 25 && current.humidity > 40 && current.humidity < 70
          ? "Favorable"
          : "Moderate",
    },
    {
      name: "Rice paddy conditions",
      status: current.temp_c > 25 && current.humidity > 60 ? "Favorable" : "Moderate",
    },
    {
      name: "Vegetable growth",
      status: current.temp_c > 20 && current.temp_c < 30 ? "Favorable" : current.temp_c > 35 ? "Poor" : "Moderate",
    },
    {
      name: "Frost risk (next 7 days)",
      status: nextWeek?.some((day) => day.day.mintemp_c < 5) ? "Moderate" : "Low",
    },
  ]

  const alerts: Array<{ type: string; message: string; severity: "low" | "medium" | "high" }> = []

  if (current.temp_c > 35) {
    alerts.push({
      type: "Heat Advisory",
      message: "High temperatures expected. Ensure adequate irrigation for crops and shade for livestock.",
      severity: "high",
    })
  }
  if (current.uv > 8) {
    alerts.push({
      type: "UV Warning",
      message: "High UV levels. Take precautions for outdoor work and protect sensitive crops.",
      severity: "medium",
    })
  }
  if (current.wind_kph > 25) {
    alerts.push({
      type: "Wind Advisory",
      message: "Strong winds may affect spraying operations and young plants.",
      severity: "medium",
    })
  }
  if (tomorrow && (tomorrow.day.daily_chance_of_rain ?? 0) > 70) {
    alerts.push({
      type: "Rain Alert",
      message: `Heavy rain expected tomorrow (${tomorrow.day.totalprecip_mm ?? 0}mm). Consider harvesting ripe crops and securing loose items.`,
      severity: (tomorrow.day.totalprecip_mm ?? 0) > 10 ? "high" : "medium",
    })
  }

  const pestRisk = {
    status: current.humidity > 75 && current.temp_c > 25 ? "High" : "Moderate",
    message:
      current.humidity > 75 && current.temp_c > 25
        ? "Current warm and humid conditions favor pest development. Monitor crops closely."
        : "Moderate pest risk. Continue regular monitoring.",
  }

  return { irrigation, fieldWork, cropConditions, alerts: alerts.length > 0 ? alerts : null, pestRisk }
}

// Date-range weather hook
export const useWeatherDataByDateRange = (location = "New Delhi", startDate?: Date, endDate?: Date) => {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Stable fallbacks to avoid changing deps every render
  const fallbackDateRef = useRef<Date>(new Date())
  const start = startDate ?? fallbackDateRef.current
  const end = endDate ?? fallbackDateRef.current

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Build inclusive date range at day precision
      const dateRange: string[] = []
      const current = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())

      while (current <= endDay) {
        dateRange.push(current.toISOString().split("T")[0])
        current.setDate(current.getDate() + 1)
      }

      const filteredForecast: WeatherData = {
        ...mockWeatherData,
        forecast: {
          forecastday:
            mockWeatherData.forecast?.forecastday
              .filter((d) => dateRange.includes(d.date))
              .map((d) => ({
                ...d,
                day: {
                  ...d.day,
                  maxtemp_c: d.day.maxtemp_c + (Math.random() * 4 - 2),
                  mintemp_c: d.day.mintemp_c + (Math.random() * 4 - 2),
                },
              })) ?? [],
        },
        location: {
          ...mockWeatherData.location,
          name: location.split(",")[0].trim(),
          country: location.includes(",") ? location.split(",")[1].trim() : "India",
        },
        lastUpdated: new Date().toLocaleString(),
      }

      setData(filteredForecast)
    } catch (err) {
      setError("Failed to fetch weather data for the selected date range. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [location, start.getTime(), end.getTime()])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
