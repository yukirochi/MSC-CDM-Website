import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import CarouselGallery from "@/pages/Home/CarouselGallery"

const facebookPageUrl =
  "https://www.facebook.com/profile.php?id=61594426612456"

function HomePage({ onJoinClick }: { onJoinClick: () => void }) {
  return (
    <main className="mx-auto mt-10 w-full max-w-7xl px-2 pb-12 sm:px-0">
      <CarouselGallery />

      <section aria-labelledby="community-feed-title" className="mt-12">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              id="community-feed-title"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Latest from our Facebook page
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              News, events, and moments from the Microsoft Student Community
              CDM.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" asChild>
              <a href={facebookPageUrl} target="_blank" rel="noreferrer">
                Visit Facebook page
                <ExternalLink aria-hidden="true" />
              </a>
            </Button>
            <Button onClick={onJoinClick}>
              Join the community
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
