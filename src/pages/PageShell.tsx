import type { ReactNode } from "react"
import { Check, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

function PageShell({
  eyebrow,
  title,
  description,
  icon: Icon,
  bannerTheme = "dark",
  bannerLogo,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  icon: LucideIcon
  bannerTheme?: "dark" | "brand-light"
  bannerLogo?: string
  children: ReactNode
}) {
  const isBrandLight = bannerTheme === "brand-light"

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <header
        className={`relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12 lg:px-14 ${
          isBrandLight
            ? "bg-gradient-to-br from-sky-100 via-white to-orange-100 text-slate-900 ring-1 ring-slate-200"
            : "bg-slate-950 text-white"
        }`}
      >
        <div
          aria-hidden="true"
          className={`absolute -right-12 -top-32 size-80 rounded-full blur-3xl ${
            isBrandLight ? "bg-blue-300/35" : "bg-blue-500/25"
          }`}
        />
        {isBrandLight && (
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -left-16 size-72 rounded-full bg-green-300/30 blur-3xl"
          />
        )}
        <div className="relative max-w-3xl">
          <Badge
            className={`mb-4 ${
              isBrandLight
                ? "border-slate-900/10 bg-white/70 text-blue-900 hover:bg-white/70"
                : "border-white/15 bg-white/10 text-blue-100 hover:bg-white/10"
            }`}
          >
            {eyebrow} · Microsoft Student Community CDM
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p
            className={`mt-4 max-w-2xl leading-7 ${
              isBrandLight ? "text-slate-700" : "text-slate-300"
            }`}
          >
            {description}
          </p>
        </div>
        {bannerLogo ? (
          <img
            src={bannerLogo}
            alt=""
            aria-hidden="true"
            className="absolute bottom-5 right-8 hidden size-28 object-contain grayscale opacity-60 sm:block"
          />
        ) : (
          <Icon
            aria-hidden="true"
            className={`absolute bottom-8 right-10 hidden size-16 sm:block ${
              isBrandLight ? "text-green-800/50" : "text-blue-200/70"
            }`}
            strokeWidth={1.2}
          />
        )}
      </header>
      <div className="mt-8">{children}</div>
    </main>
  )
}

function SectionTitle({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function DemoSuccess({ title, message }: { title: string; message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check aria-hidden="true" className="size-5" />
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-emerald-900/80">{message}</p>
    </div>
  )
}

export { DemoSuccess, PageShell, SectionTitle }
