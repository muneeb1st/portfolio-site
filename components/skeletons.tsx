export function HeroSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-7 w-32 rounded-full bg-white/5" />
      <div className="h-16 sm:h-20 lg:h-24 w-full max-w-2xl rounded-2xl bg-white/5" />
      <div className="h-6 w-full max-w-xl rounded-xl bg-white/5" />
      <div className="h-6 w-4/5 rounded-xl bg-white/5" />
      <div className="mt-8 flex gap-4">
        <div className="h-12 w-32 rounded-full bg-white/10" />
        <div className="h-12 w-32 rounded-full bg-white/5" />
      </div>
    </div>
  )
}

export function AboutSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-20 rounded-full bg-white/5 mb-6" />
      <div className="h-12 w-full max-w-2xl rounded-2xl bg-white/5 mb-4" />
      <div className="h-6 w-full max-w-xl rounded-xl bg-white/5 mb-8" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-[2rem] p-8 space-y-4">
          <div className="h-5 w-32 rounded bg-white/5" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 rounded bg-white/5" />
              <div className="h-4 w-full rounded bg-white/5" />
            </div>
          ))}
        </div>
        <div className="glass-panel rounded-[2rem] p-8 space-y-4">
          <div className="h-5 w-24 rounded bg-white/5" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 rounded bg-white/5" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-20 rounded-full bg-white/5" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProjectsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-20 rounded-full bg-white/5 mb-4" />
      <div className="h-14 w-full max-w-2xl rounded-2xl bg-white/5 mb-4" />
      <div className="h-6 w-3/5 rounded-xl bg-white/5 mb-12" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="package-card rounded-[1.85rem] p-6 space-y-4">
            <div className="h-48 rounded-[1.4rem] bg-white/5" />
            <div className="h-4 w-24 rounded bg-white/5" />
            <div className="h-8 w-3/4 rounded bg-white/5" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-2/3 rounded bg-white/5" />
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-20 rounded-full bg-white/5" />
              <div className="h-6 w-20 rounded-full bg-white/5" />
              <div className="h-6 w-20 rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ServicesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-20 rounded-full bg-white/5 mb-4" />
      <div className="h-14 w-full max-w-2xl rounded-2xl bg-white/5 mb-4" />
      <div className="h-6 w-4/5 rounded-xl bg-white/5 mb-12" />
      <div className="grid gap-8 xl:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="package-card rounded-[2rem] p-6 space-y-4">
            <div className="h-4 w-28 rounded bg-white/5" />
            <div className="h-10 w-4/5 rounded bg-white/5" />
            <div className="h-5 w-full rounded bg-white/5" />
            <div className="h-5 w-3/4 rounded bg-white/5" />
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded-full bg-white/5" />
              <div className="h-6 w-24 rounded-full bg-white/5" />
              <div className="h-6 w-24 rounded-full bg-white/5" />
            </div>
            <div className="mock-window h-48 rounded-[1.55rem] mt-4" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-12 rounded-2xl bg-black/20" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="package-card rounded-[1.85rem] p-5 space-y-3">
            <div className="h-4 w-32 rounded bg-white/5" />
            <div className="h-7 w-3/4 rounded bg-white/5" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-4/5 rounded bg-white/5" />
            <div className="space-y-2 mt-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-10 rounded-2xl bg-black/20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkillsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="glass-panel rounded-[2rem] p-8 space-y-4">
          <div className="h-6 w-20 rounded-full bg-white/5" />
          <div className="h-12 w-4/5 rounded bg-white/5" />
          <div className="h-5 w-full rounded bg-white/5" />
          <div className="flex flex-wrap gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-6 w-20 rounded-full bg-white/5" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel rounded-[2rem] p-6 space-y-3">
              <div className="h-4 w-16 rounded bg-white/5" />
              <div className="h-20 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ContactSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-24 rounded-full bg-white/5 mb-4" />
      <div className="h-14 w-full max-w-xl rounded-2xl bg-white/5 mb-4" />
      <div className="h-6 w-3/4 rounded-xl bg-white/5 mb-8" />
      <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
        <div className="glass-panel rounded-[2rem] p-8 space-y-4">
          <div className="h-5 w-16 rounded bg-white/5" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 w-12 rounded bg-white/5" />
              <div className="h-12 rounded-2xl bg-black/20" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-12 rounded bg-white/5" />
              <div className="h-12 rounded-2xl bg-black/20" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-white/5" />
            <div className="h-32 rounded-2xl bg-black/20" />
          </div>
          <div className="h-12 w-full rounded-full bg-white/10" />
        </div>
        <div className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-8 space-y-4">
            <div className="h-5 w-20 rounded bg-white/5" />
            <div className="h-6 w-4/5 rounded bg-white/5" />
            <div className="h-6 w-3/5 rounded bg-white/5" />
          </div>
          <div className="glass-panel rounded-[2rem] p-8 space-y-4">
            <div className="h-5 w-20 rounded bg-white/5" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 rounded bg-white/5" />
                    <div className="h-3 w-16 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FooterSkeleton() {
  return (
    <div className="animate-pulse border-t border-white/10 py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="h-4 w-48 rounded bg-white/5" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 w-5 rounded bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TickerSkeleton() {
  return (
    <div className="animate-pulse border-y border-white/10 py-4 overflow-hidden">
      <div className="flex gap-8 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-5 w-20 rounded bg-white/5" />
        ))}
      </div>
    </div>
  )
}