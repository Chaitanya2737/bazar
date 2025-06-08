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
    <Carousel className="w-full h-[500px] py-12    mx-auto dark:bg-gray-800 dark:text-white">
      <h1 className="text-3xl sm:text-4xl font-bold  mb-6  ">
        Runway Reels
      </h1>

      <CarouselContent>
        {Array.from({ length: image.length }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-4">
              <Card className={"dark:bg-gray-800 dark:text-white"}>
                <CardContent className="flex items-center justify-center p-6">
                  <Image
                    src={image[index] || "/placeholder-image.png"}
                    alt={`Carousel Image ${index + 1}`}
                    width={600}
                    height={400}
                    className="object-cover h-[300px] w-fit rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default Carusel;
