import { useState } from "react"
import { FolderKanban, Search } from "lucide-react"
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
import { PageShell } from "@/pages/PageShell"
import { projects } from "@/pages/mock-data"

function CommunityProjectsPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const categories = ["All", ...new Set(projects.map((project) => project.category))]
  const visibleProjects = projects.filter((project) => {
    const matchesCategory = category === "All" || project.category === category
    const searchText = `${project.title} ${project.description} ${project.category}`
    return matchesCategory && searchText.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <PageShell
      eyebrow="Projects"
      title="Ideas in progress"
      description="Explore what students are building and find a project that sparks your curiosity."
      icon={FolderKanban}
    >
      <div className="mb-6 flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search
            aria-hidden="true"
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Search projects"
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
          />
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filter project category">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={category === item ? "default" : "outline"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      {visibleProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {visibleProjects.map((project) => (
            <Card key={project.title} className="gap-4 border-border/70 shadow-none">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
                    {project.initials}
                  </div>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <CardTitle className="pt-1 text-lg">{project.title}</CardTitle>
                <CardDescription className="leading-6">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">{project.status}</span>
                <span className="text-xs font-medium text-blue-700">Student project</span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="items-center border-dashed py-10 text-center shadow-none">
          <CardContent>
            <Search aria-hidden="true" className="mx-auto mb-3 size-6 text-muted-foreground" />
            <p className="font-medium">No projects found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different keyword or category.
            </p>
          </CardContent>
        </Card>
      )}
    </PageShell>
  )
}

export default CommunityProjectsPage
