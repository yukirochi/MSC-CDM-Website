import { useState } from "react"
import { Newspaper, Sparkles } from "lucide-react"
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
import { updates } from "@/pages/mock-data"

function UpdatesList({ announcementsOnly = false }: { announcementsOnly?: boolean }) {
  const [filter, setFilter] = useState("All updates")
  const visibleUpdates = updates.filter((item) => {
    if (announcementsOnly && item.type !== "Announcement") return false
    if (!announcementsOnly && filter !== "All updates" && item.type !== filter) {
      return false
    }
    return true
  })

  return (
    <PageShell
      eyebrow="News"
      title={announcementsOnly ? "Community announcements" : "The latest from our community"}
      description={
        announcementsOnly
          ? "Important updates, opportunities, and notes for Microsoft Student Community members."
          : "Catch up on workshops, student projects, and the ideas our members are sharing."
      }
      icon={announcementsOnly ? Sparkles : Newspaper}
    >
      {!announcementsOnly && (
        <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter news">
          {["All updates", "News", "Announcement"].map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={filter === item ? "default" : "outline"}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item === "Announcement" ? "Announcements" : item}
            </Button>
          ))}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {visibleUpdates.map((item) => (
          <Card key={item.title} className="gap-4 border-border/70 shadow-none">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant={item.type === "Announcement" ? "default" : "secondary"}>
                  {item.tag}
                </Badge>
                <span className="text-xs text-muted-foreground">{item.date}</span>
              </div>
              <CardTitle className="pt-2 text-lg leading-6">{item.title}</CardTitle>
              <CardDescription className="leading-6">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-xs font-medium text-muted-foreground">{item.type}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}

export default UpdatesList
