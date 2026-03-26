import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-96 mb-6" />

      <Skeleton className="h-10 w-full mb-8" />

      <div className="border rounded-lg p-6">
        <div className="max-w-xl mx-auto">
          <div className="mb-4">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>

          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
