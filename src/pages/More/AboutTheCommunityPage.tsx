import { BookOpen, Info, Lightbulb, UsersRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageShell } from "@/pages/PageShell"

const values = [
  {
    title: "Learn together",
    description: "Make it easier for every student to explore new skills and share knowledge.",
    icon: BookOpen,
  },
  {
    title: "Make things that matter",
    description: "Turn curiosity into thoughtful projects with a positive impact.",
    icon: Lightbulb,
  },
  {
    title: "Make space for everyone",
    description: "Welcome different backgrounds, ideas, and levels of experience.",
    icon: UsersRound,
  },
]

function AboutTheCommunityPage() {
  return (
    <PageShell
      eyebrow="About"
      title="A community built around curiosity"
      description="Microsoft Student Community CDM brings students together to learn, create, and help each other grow."
      icon={Info}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="mb-5 text-xl font-semibold tracking-tight">
            A student community, shaped by students
          </h2>
          <p className="max-w-2xl leading-7 text-muted-foreground">
            Microsoft Student Community CDM is a place for students to explore
            technology, exchange ideas, and work on projects together. We bring
            people together through practical events and a shared belief that
            learning is better when it is collaborative.
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            This page uses sample content. The community’s actual programs,
            partnerships, and membership details can be added when they are ready.
          </p>
        </div>
        <Card className="border-blue-100 bg-blue-50/60 shadow-none">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">Our purpose</Badge>
            <CardTitle className="text-2xl leading-8">
              Create a space where students can learn by building together.
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {values.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="border-border/70 shadow-none">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription className="leading-6">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}

export default AboutTheCommunityPage
