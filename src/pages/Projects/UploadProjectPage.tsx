import { useState, type FormEvent } from "react"
import { ArrowRight, Code2 } from "lucide-react"
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
import { DemoSuccess, PageShell } from "@/pages/PageShell"

function UploadProjectPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageShell
      eyebrow="Projects"
      title="Share what you’re building"
      description="Tell the community about a project. This demo form will not upload or store anything."
      icon={Code2}
    >
      <div className="mx-auto max-w-3xl">
        <Card className="gap-0 border-border/70 py-0 shadow-sm">
          <CardHeader className="border-b px-6 py-6 sm:px-8">
            <CardTitle className="text-xl">Project details</CardTitle>
            <CardDescription className="leading-6">
              Share enough for others to understand your idea and how they might help.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6 sm:px-8">
            {submitted ? (
              <DemoSuccess
                title="Project draft created"
                message="Your project is shown as a local demo only. It has not been uploaded or saved."
              />
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="project-title">Project name</Label>
                  <Input id="project-title" name="title" placeholder="What are you building?" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-category">Category</Label>
                  <Input
                    id="project-category"
                    name="category"
                    placeholder="e.g. Web, creative, social impact"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Project description</Label>
                  <Textarea
                    id="project-description"
                    name="description"
                    placeholder="What problem does it solve? Who would you like to collaborate with?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-link">
                    Project link <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input id="project-link" name="link" type="url" placeholder="https://" />
                </div>
                <Button type="submit">
                  Create demo project
                  <ArrowRight aria-hidden="true" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Demo only. No project details or files are sent or stored.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default UploadProjectPage
