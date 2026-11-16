import { ArrowRight, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageShell } from "@/pages/PageShell"

const guidelines = [
  {
    number: "01",
    title: "Be curious and kind",
    description:
      "Ask questions, share what you know, and make room for people with different levels of experience.",
  },
  {
    number: "02",
    title: "Learn by doing",
    description:
      "Try a workshop, contribute a small idea, or join a project. There is no expectation to know everything first.",
  },
  {
    number: "03",
    title: "Build together",
    description:
      "Give helpful feedback, credit collaborators, and treat shared work and ideas with respect.",
  },
  {
    number: "04",
    title: "Keep the community welcoming",
    description:
      "Help create an inclusive space where every student can participate and feel supported.",
  },
]

function MembershipGuidelinesPage({
  onJoinClick,
}: {
  onJoinClick: () => void
}) {
  return (
    <PageShell
      eyebrow="Registration"
      title="Membership Guidelines"
      description="A few shared principles help make this a welcoming, useful space for every student."
      icon={BookOpen}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {guidelines.map(({ number, title, description }) => (
            <Card key={number} className="gap-3 border-border/70 shadow-none">
              <CardHeader>
                <Badge variant="secondary" className="mb-1 w-fit">
                  {number}
                </Badge>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="leading-6">{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card className="h-fit border-blue-100 bg-blue-50/60">
          <CardHeader>
            <CardTitle>Getting started is easy</CardTitle>
            <CardDescription className="leading-6">
              There are no dues or experience requirements in this mockup. Start
              by introducing yourself and choosing an event that sounds fun.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onJoinClick}>
              Join the community
              <ArrowRight aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default MembershipGuidelinesPage
