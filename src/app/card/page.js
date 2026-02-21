import { ArrowDownRight, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

const Page = () => {
  const images = [
    { img: "/trusted-by/Ambassador.png"
        
     },

    { img: "/trusted-by/ranada.png" },
    { img: "/trusted-by/promoj.png" },
    { img: "/trusted-by/sunil.png" },
    { img: "/trusted-by/sonaiwithgraybackground.png" },
    { img: "/trusted-by/datta.png" },
    { img: "/trusted-by/radhesham.png" },
    { img: "/trusted-by/hotelBhyagashri.png" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((items, index) => (
          <div
            key={index}
            className="relative w-72  aspect-[3/4] overflow-hidden rounded-3xl shadow-xl group"
          >
            <Image
              src={items.img}
              fill
              className="object-cover group-hover:scale-105 transition duration-500"
              alt="Image"
            />

            {/* Top Icon */}
            <div className="absolute top-4 right-4 z-10 backdrop-blur-sm bg-white/30 p-3 rounded-full shadow-lg hover:scale-110 transition">
              <ArrowDownRight className="w-5 h-5 text-black" />
            </div>

            {/* Bottom Glass Section */}
            <div className="absolute bottom-0 w-full backdrop-blur-md bg-white/20 p-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              <h1 className="font-semibold mt-2">Black Star</h1>
              <p className="text-sm text-gray-700">
                Lorem ipsum dolor sit amet consectetur.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
