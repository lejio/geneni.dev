import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/Carousel";

import JHUAPL from "./JHUAPL";
import MSU from "./MSU";

export default function Experience() {
  // #052f73
  return (
    <Carousel className="max-w-[1920px] max-h-[1080px] w-full h-[85vh] flex flex-col items-center justify-center">
      <CarouselContent>
        <CarouselItem className="w-full">
          <div className="p-5 h-full bg-gradient-to-bl from-green-400 to-[#18453B] rounded-xl">
            <MSU />
          </div>
        </CarouselItem>
        <CarouselItem className="w-full">
          <div className="p-5 h-full bg-gradient-to-bl from-[#052f73] to-blue-400 rounded-xl">
            <JHUAPL />
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
}
