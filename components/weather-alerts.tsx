import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CloudRain, Thermometer, Wind } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface WeatherAlert {
  type: string
  message: string
  severity: "low" | "medium" | "high"
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[] | null
  loading: boolean
}

export function WeatherAlerts({ alerts, loading }: WeatherAlertsProps) {
  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weather Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 rounded-md"></div>
            <div className="h-20 bg-slate-200 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weather Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-green-50 rounded-full p-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-green-500" />
            </div>
            <p className="font-medium">No active weather alerts</p>
            <p className="text-sm text-muted-foreground mt-1">
              Weather conditions are favorable for farming activities
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getAlertIcon = (type: string) => {
    if (type.toLowerCase().includes("heat")) return Thermometer
    if (type.toLowerCase().includes("rain") || type.toLowerCase().includes("storm")) return CloudRain
    if (type.toLowerCase().includes("wind")) return Wind
    return AlertTriangle
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50 text-red-800"
      case "medium":
        return "border-amber-200 bg-amber-50 text-amber-800"
      default:
        return "border-blue-200 bg-blue-50 text-blue-800"
    }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const AlertIcon = getAlertIcon(alert.type)
            return (
              <Alert key={index} className={cn("border-l-4", getAlertColor(alert.severity))}>
                <AlertIcon className="h-4 w-4" />
                <AlertTitle>{alert.type}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
