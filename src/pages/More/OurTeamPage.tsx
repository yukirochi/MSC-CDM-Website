import { UsersRound } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageShell, SectionTitle } from "@/pages/PageShell"
import { team } from "@/pages/mock-data"

function OurTeamPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Meet the people behind the community"
      description="A student-led team helps make every workshop, project, and new-member welcome happen."
      icon={UsersRound}
    >
      <SectionTitle
        title="Student organizers"
        description="Meet a sample of the students who help bring the community together."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <Card key={member.name} className="items-center border-border/70 py-7 text-center shadow-none">
            <div className={`flex size-16 items-center justify-center rounded-full text-lg font-semibold ${member.color}`}>
              {member.initials}
            </div>
            <CardHeader className="items-center gap-2 text-center">
              <CardTitle>{member.name}</CardTitle>
              <CardDescription>{member.role}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Names and roles are sample data for this preview.
      </p>
    </PageShell>
  )
}

export default OurTeamPage
