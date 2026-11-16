import { useState } from "react"
import { BookOpen, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageShell } from "@/pages/PageShell"
import { faqs } from "@/pages/mock-data"

function FrequentlyAskedQuestionsPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0].question)

  return (
    <PageShell
      eyebrow="Help"
      title="Frequently asked questions"
      description="New here? Find quick answers about joining, events, and getting involved."
      icon={BookOpen}
    >
      <div className="mx-auto max-w-3xl divide-y rounded-xl border bg-card">
        {faqs.map(({ question, answer }) => {
          const isOpen = openQuestion === question
          return (
            <div key={question} className="px-5">
              <Button
                type="button"
                variant="ghost"
                aria-expanded={isOpen}
                className="h-auto min-h-14 w-full justify-between py-4 text-left whitespace-normal"
                onClick={() => setOpenQuestion(isOpen ? null : question)}
              >
                <span className="font-medium">{question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`size-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </Button>
              {isOpen && (
                <p className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">
                  {answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}

export default FrequentlyAskedQuestionsPage
