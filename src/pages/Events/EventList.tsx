import { useState } from "react"
import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
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
import { PageShell } from "@/pages/PageShell"
import { events } from "@/pages/mock-data"

function EventList({ calendar = false }: { calendar?: boolean }) {
  const [rsvps, setRsvps] = useState<string[]>([])

  return (
    <PageShell
      eyebrow="Events"
      title={calendar ? "Community calendar" : "Make time to make something"}
      description={
        calendar
          ? "A quick look at the workshops and meetups planned for November 2026."
          : "Meet the community at a workshop, project night, or casual get-together."
      }
      icon={CalendarDays}
    >
      {calendar && (
        <Card className="mb-6 border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">November 2026</CardTitle>
            <CardDescription>Upcoming community dates at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {events.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="flex min-w-48 items-center gap-3 rounded-lg border bg-background p-3"
              >
                <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-md bg-blue-50 text-blue-700">
                  <span className="text-[0.6rem] font-semibold">{event.month}</span>
                  <span className="text-lg font-semibold leading-5">{event.day}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4">
        {events.map((event) => {
          const isGoing = rsvps.includes(event.id)
          return (
            <Card key={event.id} className="gap-0 border-border/70 py-0 shadow-none">
              <div className="grid md:grid-cols-[7rem_1fr_auto]">
                <div className="flex items-center justify-center gap-2 rounded-t-xl bg-blue-50 p-4 text-blue-800 md:flex-col md:rounded-l-xl md:rounded-tr-none">
                  <span className="text-xs font-semibold tracking-wide">{event.month}</span>
                  <span className="text-3xl font-semibold leading-none">{event.day}</span>
                </div>
                <CardContent className="py-5 md:py-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold">{event.title}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {event.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 aria-hidden="true" className="size-3.5" />
                      {event.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-3.5" />
                      {event.location}
                    </span>
                  </div>
                </CardContent>
                <div className="flex items-center px-6 pb-5 md:pr-6 md:pb-0">
                  <Button
                    type="button"
                    variant={isGoing ? "secondary" : "outline"}
                    aria-pressed={isGoing}
                    onClick={() =>
                      setRsvps((current) =>
                        isGoing
                          ? current.filter((id) => id !== event.id)
                          : [...current, event.id]
                      )
                    }
                  >
                    {isGoing ? (
                      <>
                        <Check aria-hidden="true" />
                        Going
                      </>
                    ) : (
                      "RSVP"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Event details and RSVPs are mock data for this preview.
      </p>
    </PageShell>
  )
}

export default EventList
