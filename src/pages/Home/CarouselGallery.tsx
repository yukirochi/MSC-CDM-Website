import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import image1 from "@/assets/images/900292128_122127571935480887_4266223858539071867_n.jpg"
import image2 from "@/assets/images/901258660_122127571845480887_330511539778841732_n.jpg"
import image3 from "@/assets/images/904244756_122127571887480887_8787039304646730211_n.jpg"
import image4 from "@/assets/images/904700225_122127571893480887_8113090349662461923_n.jpg"

const carouselImages = [image1, image2, image3, image4]

function CarouselGallery() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const updateCurrent = () => setCurrent(api.selectedScrollSnap())
    updateCurrent()
    api.on("select", updateCurrent)
    api.on("reInit", updateCurrent)

    return () => {
      api.off("select", updateCurrent)
      api.off("reInit", updateCurrent)
    }
  }, [api])

  return (
    <Carousel className="w-full max-w-7xl" opts={{ loop: true }} setApi={setApi}>
      <CarouselContent>
        {carouselImages.map((image, index) => (
          <CarouselItem key={image}>
            <div className="p-1">
              <Card className="overflow-hidden py-0">
                <CardContent className="flex aspect-[3/2] items-center justify-center overflow-hidden bg-muted p-0 sm:aspect-[2.35/1]">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div
        role="group"
        aria-label="Carousel navigation"
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-0"
      >
        {carouselImages.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to image ${index + 1}`}
            aria-pressed={current === index}
            onClick={() => api?.scrollTo(index)}
            className="flex size-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={`size-2.5 rounded-full border border-background transition-colors ${
                current === index
                  ? "bg-primary"
                  : "bg-background/70 hover:bg-background"
              }`}
            />
          </button>
        ))}
      </div>
    </Carousel>
  )
}

export default CarouselGallery
