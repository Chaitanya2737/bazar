"use client";
import React, { useEffect, useRef } from "react";
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
  const nextButtonWrapperRef = useRef(null);

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextBtn = nextButtonWrapperRef.current?.querySelector("button");
      if (nextBtn) {
        nextBtn.click();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Carousel
      opts={{ loop: true }}  // 🔑 enables infinite looping
      className="relative w-[90%] mx-auto py-12 dark:bg-gray-800 dark:text-white"
    >
      <CarouselContent>
        {image.map((imgUrl, index) => (
          <CarouselItem key={index}>
            <div className="p-4">
              <Card className="dark:bg-gray-800 dark:text-white">
                <CardContent className="flex items-center justify-center p-6 h-auto md:h-[400px] w-full">
                  <div className="relative w-full h-auto md:h-full">
                    <Image
                      src={imgUrl || "/placeholder-image.png"}
                      alt={`Carousel Image ${index + 1}`}
                      width={800}
                      height={600}
                      className="w-full h-auto md:h-full object-contain rounded-lg"
                      priority
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation Buttons */}
      {image.length > 0 && (
        <>
          <CarouselPrevious className="absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-md hover:bg-white text-black rounded-full p-5 shadow" />
          <div
            ref={nextButtonWrapperRef}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-10"
          >
            <CarouselNext className="bg-white/80 backdrop-blur-md hover:bg-white text-black rounded-full p-5 shadow" />
          </div>
        </>
      )}
    </Carousel>
  );
};

export default Carusel;
