import { Skeleton } from "@/components/ui/skeleton"
 
export function SkeletonCard() {
  return (
    <div className="p-5 opacity-50">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-full mb-2" />
      <div className="flex items-center gap-2 mt-2">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-16" />
      </div>
    </div>
  )
}