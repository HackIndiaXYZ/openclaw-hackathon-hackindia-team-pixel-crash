import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MarketAnalysisLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <Card className="overflow-hidden border-t-4 border-t-green-600">
        <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardTitle className="flex items-center gap-2">
            <span className="bg-green-600 w-2 h-6 rounded-full inline-block"></span>
            Market Overview
          </CardTitle>
          <CardDescription>Current prices from major agricultural markets across India</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border border-green-100">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-t-4 border-t-blue-600">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
          <CardTitle className="flex items-center gap-2">
            <span className="bg-blue-600 w-2 h-6 rounded-full inline-block"></span>
            Market Insights
          </CardTitle>
          <CardDescription>Latest trends and forecasts for agricultural markets</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
              <Skeleton className="h-[100px]" />
            </div>
            <Skeleton className="h-[150px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
