import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Carusel = ({ image }) => {
  return (
    <Carousel className="relative w-[90%] mx-auto py-12 dark:bg-gray-800 dark:text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Runway Reels</h1>

      {/* Carousel Slides */}
      <CarouselContent>
        {image.map((imgUrl, index) => (
          <CarouselItem key={index}>
            <div className="p-4">
              <Card className="dark:bg-gray-800 dark:text-white">
                <CardContent className="flex items-center justify-center p-6">
                  <Image
                    src={imgUrl || "/placeholder-image.png"}
                    alt={`Carousel Image ${index + 1}`}
                    width={600}
                    height={400}
                    className="object-cover h-[300px] w-auto rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Buttons - Centered */}
      <CarouselPrevious className=" absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-black rounded-full p-5 shadow" />
      <CarouselNext className="absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-black rounded-full p-5 shadow" />
    </Carousel>
  );
};

export default Carusel;
