import { useState, type FormEvent } from "react"
import {
  ArrowRight,
  Check,
  Code2,
  GraduationCap,
  Lightbulb,
  Megaphone,
  UsersRound,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const communityHighlights = [
  {
    icon: Code2,
    title: "Build real skills",
    description:
      "Learn through hands-on workshops, peer sessions, and practical projects.",
    color: "bg-sky-100 text-sky-700",
  },
  {
    icon: UsersRound,
    title: "Find your people",
    description:
      "Meet curious students who are excited to share, learn, and make things together.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: Lightbulb,
    title: "Bring ideas to life",
    description:
      "Turn a small idea into a project with teammates and a supportive community.",
    color: "bg-amber-100 text-amber-700",
  },
]

const communityStats = [
  { value: "500+", label: "student members" },
  { value: "20+", label: "events each year" },
  { value: "All levels", label: "welcome here" },
]

const interests = ["Technology", "Design", "Events", "Community"]

export function JoinCommunityPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <section className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-32 -z-10 size-96 rounded-full bg-blue-500/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 left-1/3 -z-10 size-96 rounded-full bg-violet-500/20 blur-3xl"
        />
        <div className="max-w-3xl">
          <Badge className="mb-5 border-white/15 bg-white/10 text-blue-100 hover:bg-white/10">
            Microsoft Student Community · CDM
          </Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Your next big idea starts with{" "}
            <span className="text-blue-300">your people.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Join a welcoming community of students exploring technology,
            creating projects, and learning from one another.
          </p>
          <a
            href="#application"
            className="mt-8 inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-500">
              Become a member
              <ArrowRight aria-hidden="true" />
            </Button>
          </a>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6 sm:mt-12">
            {communityStats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-lg font-semibold text-white">{value}</p>
                <p className="mt-0.5 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute -right-20 bottom-0 hidden size-[26rem] items-center justify-center rounded-full border border-white/10 lg:flex"
        >
          <div className="flex size-72 items-center justify-center rounded-full border border-white/10">
            <div className="flex size-48 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
              <GraduationCap className="size-20 text-blue-200/80" strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-12 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div>
          <Badge variant="secondary" className="mb-4">
            Why join us
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            More than a club.
            <br />
            <span className="text-muted-foreground">A place to grow.</span>
          </h2>
          <p className="mt-4 max-w-md leading-7 text-muted-foreground">
            Whether you are just getting started or already building things,
            there is room for you here. Bring your curiosity—we will figure out
            the rest together.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "No experience or special equipment required",
              "Friendly events designed for students",
              "A chance to learn, contribute, and lead",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {communityHighlights.map(({ icon: Icon, title, description, color }) => (
              <Card key={title} className="gap-3 border-border/70 py-4 shadow-none">
                <CardContent className="px-4">
                  <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${color}`}>
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card id="application" className="scroll-mt-8 gap-0 border-border/70 py-0 shadow-lg shadow-slate-950/5">
          <CardHeader className="border-b px-6 py-6 sm:px-8">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Megaphone aria-hidden="true" className="size-5" />
            </div>
            <CardTitle className="text-2xl">Let’s get to know you</CardTitle>
            <CardDescription className="mt-2 leading-6">
              Share a little about yourself to get started. This is a demo
              application—your details stay in this preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6 sm:px-8 sm:py-8">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Thanks for reaching out!</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                  Your demo application is ready. In the live site, the
                  community team would follow up with next steps.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5 border-emerald-300 bg-white text-emerald-950 hover:bg-emerald-100"
                  onClick={() => setSubmitted(false)}
                >
                  Edit application
                </Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full name</Label>
                    <Input
                      id="full-name"
                      name="name"
                      placeholder="Alex Morgan"
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Student email</Label>
                    <Input
                      id="student-email"
                      name="email"
                      type="email"
                      placeholder="you@school.edu"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course or area of study</Label>
                  <Input
                    id="course"
                    name="course"
                    placeholder="e.g. Information Technology"
                    required
                  />
                </div>
                <fieldset className="space-y-3">
                  <legend className="text-sm leading-none font-medium">
                    What are you interested in?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => {
                      const selected = selectedInterests.includes(interest)
                      return (
                        <Button
                          key={interest}
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          aria-pressed={selected}
                          onClick={() =>
                            setSelectedInterests((current) =>
                              selected
                                ? current.filter((item) => item !== interest)
                                : [...current, interest]
                            )
                          }
                        >
                          {selected && <Check aria-hidden="true" />}
                          {interest}
                        </Button>
                      )
                    })}
                  </div>
                </fieldset>
                <div className="space-y-2">
                  <Label htmlFor="about-you">
                    Anything else you’d like us to know?{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="about-you"
                    name="about"
                    placeholder="Tell us what you hope to learn or create..."
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-500">
                  Send demo application
                  <ArrowRight aria-hidden="true" />
                </Button>
                <p className="text-center text-xs leading-5 text-muted-foreground">
                  Demo only. Nothing is sent or stored.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default JoinCommunityPage
