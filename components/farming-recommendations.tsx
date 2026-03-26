import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Tractor, Bug, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FarmingRecommendation {
  irrigation: {
    status: string
    message: string
    icon: string
  }
  fieldWork: {
    status: string
    message: string
    icon: string
  }
  cropConditions: Array<{
    name: string
    status: string
  }>
  pestRisk: {
    status: string
    message: string
  }
}

interface FarmingRecommendationsProps {
  recommendations: FarmingRecommendation | null
  loading: boolean
}

export function FarmingRecommendations({ recommendations, loading }: FarmingRecommendationsProps) {
  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Farming Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-slate-200 rounded-md"></div>
            <div className="h-24 bg-slate-200 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recommendations) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Farming Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No recommendations available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
      case "favorable":
        return "bg-green-100 text-green-800"
      case "caution":
      case "moderate":
        return "bg-amber-100 text-amber-800"
      case "poor":
      case "high":
      case "dry":
        return "bg-red-100 text-red-800"
      case "wet":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Farming Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Irrigation */}
          <div className="flex-1 border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Irrigation</h3>
              <Badge className={cn("ml-auto", getStatusColor(recommendations.irrigation.status))}>
                {recommendations.irrigation.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{recommendations.irrigation.message}</p>
          </div>

          {/* Field Work */}
          <div className="flex-1 border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tractor className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">Field Work</h3>
              <Badge className={cn("ml-auto", getStatusColor(recommendations.fieldWork.status))}>
                {recommendations.fieldWork.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{recommendations.fieldWork.message}</p>
          </div>
        </div>

        {/* Pest Risk */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Pest Risk</h3>
            <Badge className={cn("ml-auto", getStatusColor(recommendations.pestRisk.status))}>
              {recommendations.pestRisk.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{recommendations.pestRisk.message}</p>
        </div>

        {/* Crop Conditions */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Crop Conditions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recommendations.cropConditions.map((condition, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{condition.name}</span>
                <Badge className={getStatusColor(condition.status)}>{condition.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
