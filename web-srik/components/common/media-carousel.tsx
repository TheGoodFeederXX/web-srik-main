"use client"

import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { glassStyles } from "@/lib/glass-styles"

type MediaItem = {
  id: string
  url: string
  jenis?: "gambar" | "video"
  caption?: string
}

interface MediaCarouselProps {
  items: MediaItem[]
  itemsPerView?: "one" | "two" | "three"
  aspectRatio?: "square" | "video" | "portrait" | "custom"
  showCaption?: boolean
  className?: string
  glassmorphic?: boolean
}

export default function MediaCarousel({
  items,
  itemsPerView = "three",
  aspectRatio = "video",
  showCaption = true,
  className,
  glassmorphic = false
}: MediaCarouselProps) {
  const getAspectRatio = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "video":
        return "aspect-[4/3]"
      case "portrait":
        return "aspect-[3/4]"
      case "custom":
        return ""
      default:
        return "aspect-[4/3]"
    }
  }

  const getItemsPerView = () => {
    switch (itemsPerView) {
      case "one":
        return "basis-full"
      case "two":
        return "basis-full md:basis-1/2"
      case "three":
        return "basis-full md:basis-1/2 lg:basis-1/3"
      default:
        return "basis-full md:basis-1/2 lg:basis-1/3"
    }
  }

  return (
    <Carousel className={cn("w-full", className)}>
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id} className={getItemsPerView()}>
            <div className={cn("p-1", glassmorphic && glassStyles.glassLight)}>
              <div className={cn("relative rounded-lg overflow-hidden", getAspectRatio())}>
                {(!item.jenis || item.jenis === "gambar") ? (
                  <Image
                    src={item.url}
                    alt={item.caption || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              {showCaption && item.caption && (
                <p className="mt-2 text-sm text-center text-gray-600">{item.caption}</p>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
