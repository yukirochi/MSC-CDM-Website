import { useEffect, useState } from "react"
import { UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import logo from "@/assets/logo/a373d43f-61d3-4ecb-b6ae-4bef2e3d252f-removebg-preview.png"
import { fetchTeamMembers, type TeamMember } from "@/lib/team-sheet"
import { PageShell, SectionTitle } from "@/pages/PageShell"

const photoGradients = [
  "from-blue-500/40 via-blue-400/20 to-transparent",
  "from-red-500/40 via-red-400/20 to-transparent",
  "from-green-500/40 via-green-400/20 to-transparent",
]

function OurTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeam() {
      setIsLoading(true)
      setError(null)

      try {
        setTeam(await fetchTeamMembers(controller.signal))
      } catch (loadError) {
        if (controller.signal.aborted) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load the officers spreadsheet."
        )
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void loadTeam()
    return () => controller.abort()
  }, [retryCount])

  return (
    <PageShell
      eyebrow="About"
      title="Meet our team"
      description="Meet the student officers of the Microsoft Student Community - CDM."
      icon={UsersRound}
      bannerTheme="brand-light"
      bannerLogo={logo}
    >
      <SectionTitle
        title="MSC-CDM officers"
        description="The people helping our community learn, build, and grow together."
      />
      {isLoading && (
        <Card role="status">
          <CardHeader>
            <CardDescription>Loading officers…</CardDescription>
          </CardHeader>
        </Card>
      )}
      {error && (
        <Card role="alert">
          <CardHeader>
            <CardDescription>{error}</CardDescription>
            <Button
              type="button"
              variant="outline"
              className="mt-2 w-fit"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again
            </Button>
          </CardHeader>
        </Card>
      )}
      {!isLoading && !error && team.length === 0 && (
        <Card>
          <CardHeader>
            <CardDescription>No officers are listed yet.</CardDescription>
          </CardHeader>
        </Card>
      )}
      {!isLoading && !error && team.length > 0 && (
        <div
          role="list"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <Card
            role="listitem"
            className="flex items-center justify-center self-stretch overflow-hidden border-border/70 bg-muted/20 p-6 shadow-sm"
          >
            <img
              src={logo}
              alt="Microsoft Student Community CDM logo"
              className="w-2/3 max-w-56 object-contain"
            />
          </Card>
          {team.map((member, index) => (
            <Card
              key={member.name}
              role="listitem"
              className="group relative gap-0 overflow-hidden border-border/70 py-0 shadow-sm transition-shadow duration-300 hover:border-yellow-400 hover:shadow-md before:pointer-events-none before:absolute before:inset-0 before:z-10 before:scale-[0.98] before:rounded-xl before:border-2 before:border-yellow-400 before:opacity-0 before:transition-all before:duration-300 before:content-[''] hover:before:scale-100 hover:before:opacity-100"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={`${member.name}, ${member.position}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex size-full items-center justify-center text-muted-foreground"
                  >
                    <UsersRound className="size-12" />
                  </div>
                )}
                {member.imageUrl && (
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t ${photoGradients[index % photoGradients.length]}`}
                  />
                )}
              </div>
              <CardHeader className="gap-1.5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardDescription className="leading-5">
                      {member.position}
                    </CardDescription>
                    <CardTitle className="mt-1 font-poppins text-lg font-semibold">
                      {member.name}
                    </CardTitle>
                  </div>
                  {member.linkedinUrl ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      aria-label={`${member.name} on LinkedIn`}
                      title="View LinkedIn profile"
                      className="shrink-0 bg-transparent p-0 hover:scale-110 hover:bg-transparent"
                    >
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-6 items-center justify-center rounded-[3px] bg-[#0A66C2] font-poppins text-sm font-bold leading-none tracking-[-0.08em] text-white shadow-sm"
                        >
                          in
                        </span>
                      </a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled
                      aria-label={`${member.name} LinkedIn profile not provided`}
                      title="LinkedIn profile not added yet"
                      className="shrink-0 bg-transparent p-0 hover:scale-110 hover:bg-transparent disabled:opacity-100"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-6 items-center justify-center rounded-[3px] bg-[#0A66C2] font-poppins text-sm font-bold leading-none tracking-[-0.08em] text-white shadow-sm"
                      >
                        in
                      </span>
                    </Button>
                  )}
                </div>
                {member.description && (
                  <CardDescription className="leading-5">
                    {member.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  )
}

export default OurTeamPage
