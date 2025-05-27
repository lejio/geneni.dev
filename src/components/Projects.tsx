import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/Carousel"

export default function Projects() {
  return (
    <Carousel className="w-full h-[85vh] flex flex-col items-center justify-center">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem className="w-full" key={index}>
            <div className="p-1 h-full border border-black rounded-xl">
                <h2>{index}</h2>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
