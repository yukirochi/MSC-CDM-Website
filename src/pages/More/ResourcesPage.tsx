import { useState } from "react"
import { ExternalLink, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DemoSuccess, PageShell } from "@/pages/PageShell"
import { resources } from "@/pages/mock-data"

function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<string | null>(null)

  return (
    <PageShell
      eyebrow="Explore"
      title="A starting point for your next idea"
      description="Browse a few hand-picked learning resources shared by the community."
      icon={GraduationCap}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {resources.map(({ title, category, description, icon: Icon }) => (
          <Card key={title} className="gap-4 border-border/70 shadow-none">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon aria-hidden="true" className="size-5" />
              </div>
              <Badge variant="secondary" className="w-fit">{category}</Badge>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="leading-6">{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedResource(title)}
              >
                Preview resource
                <ExternalLink aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedResource && (
        <div className="mt-5">
          <DemoSuccess
            title={`${selectedResource} selected`}
            message="This resource is a placeholder. A real destination can be linked when the content is available."
          />
        </div>
      )}
    </PageShell>
  )
}

export default ResourcesPage
