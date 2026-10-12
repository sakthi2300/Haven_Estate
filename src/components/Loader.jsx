export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-muted" role="status" aria-live="polite">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-sand border-t-[#B68B3C]" />
      <span className="text-sm tracking-wide">{label}</span>
    </div>
  )
}

export function PropertySkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sand bg-white">
      <div className="aspect-[4/3] animate-pulse bg-cream" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse bg-cream" />
        <div className="h-5 w-3/4 animate-pulse bg-cream" />
        <div className="h-4 w-1/2 animate-pulse bg-cream" />
      </div>
    </div>
  )
}
