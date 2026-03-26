import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function KisanSetuLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section Skeleton */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-green-600 to-green-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Skeleton className="h-6 w-48 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-16 w-96 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-80 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-4 w-96 mx-auto mb-8 bg-white/20" />
            
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4">
                  <Skeleton className="h-8 w-16 mx-auto mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-20 mx-auto bg-white/20" />
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-40 bg-white/20" />
              <Skeleton className="h-12 w-40 bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <Skeleton className="h-10 w-80" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </div>

          {/* Content Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
