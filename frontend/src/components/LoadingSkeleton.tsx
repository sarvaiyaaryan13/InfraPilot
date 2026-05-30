interface LoadingSkeletonProps {
  className?: string
  count?: number
}

export function LoadingSkeleton({ className = '', count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200 rounded ${className}`}
        />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-8 w-8 rounded-lg" />
        <LoadingSkeleton className="h-4 w-16" />
      </div>
      <LoadingSkeleton className="h-7 w-24" />
      <LoadingSkeleton className="h-4 w-32" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <LoadingSkeleton className="h-10 w-full rounded-lg" />
      {Array.from({ length: rows }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  )
}