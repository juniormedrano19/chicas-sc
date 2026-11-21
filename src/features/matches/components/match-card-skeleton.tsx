import { Skeleton } from "@/components/ui/skeleton";

export const matchCardClassName = "min-w-[82%] sm:min-w-[calc(50%-10px)] lg:min-w-[calc(25%-12px)] shrink-0 snap-start rounded-xl border border-secondary/15 bg-white/95 p-4 sm:p-5 shadow-sm";

export function MatchCardSkeletonContent() {
  return <div aria-hidden="true">
    <div className="flex h-4 items-center justify-between gap-3"><Skeleton className="h-3 w-20" /><Skeleton className="h-3 w-16" /></div>
    <div className="my-6 flex h-11 items-center justify-between gap-3">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="flex items-center gap-2"><Skeleton className="h-8 w-5" /><Skeleton className="h-4 w-1" /><Skeleton className="h-8 w-5" /></div>
      <Skeleton className="size-11 shrink-0 rounded-full" />
    </div>
    <div className="flex h-4 items-center justify-between gap-4"><Skeleton className="h-3 w-28 max-w-[45%]" /><Skeleton className="h-3 w-24 max-w-[45%]" /></div>
    <div className="mt-5 border-t pt-3"><div className="flex h-4 items-center"><Skeleton className="h-3 w-32" /></div></div>
  </div>;
}

export function MatchCardSkeleton() {
  return <article className={matchCardClassName} aria-label="Cargando partido" aria-busy="true"><MatchCardSkeletonContent /></article>;
}
