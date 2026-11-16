import { useState, type FormEvent } from "react"
import { ArrowRight, Mail } from "lucide-react"
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
import { DemoSuccess, PageShell, SectionTitle } from "@/pages/PageShell"

function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <PageShell
      eyebrow="Get in touch"
      title="We’d love to hear from you"
      description="Have a question, idea, or collaboration in mind? Send the team a note."
      icon={Mail}
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionTitle title="Say hello" description="We’ll be glad to hear from you." />
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Mail aria-hidden="true" className="size-5" />
              </div>
              <CardTitle className="text-base">Community inbox</CardTitle>
              <CardDescription className="leading-6">
                hello@msc-cdm.example
                <br />
                Sample contact details for this preview.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card className="gap-0 border-border/70 py-0 shadow-sm">
          <CardHeader className="border-b px-6 py-6">
            <CardTitle>Send a message</CardTitle>
            <CardDescription>
              Demo only—this form will not send or store your message.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">
            {submitted ? (
              <DemoSuccess
                title="Message ready"
                message="Thanks for getting in touch. This is a local demo confirmation; nothing was sent."
              />
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name</Label>
                    <Input id="contact-name" name="name" autoComplete="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" name="email" type="email" autoComplete="email" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Subject</Label>
                  <Input id="contact-subject" name="subject" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea id="contact-message" name="message" required />
                </div>
                <Button type="submit">
                  Prepare demo message
                  <ArrowRight aria-hidden="true" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

export default ContactUsPage
