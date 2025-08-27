import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import "@/app/globals.css";

const MainSection = ({
  businessName,
  icon,
  mobileNumber = [],
  bio,
  handlerName,
  gstNumber,
  location,
}) => {
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  // Simulate API fetch for loading state
  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Placeholder for API
      setLoading(false);
    };
    fetchData();
  }, []);

  // Bio truncation logic
  const words = bio?.trim().split(" ") || [];
  const isLong = words.length > 50;
  const shortBio = isLong ? words.slice(0, 50).join(" ") + "…" : bio;

  // Loading UI with dynamic phone number skeletons
  if (loading) {
    return (
      <section className="transition-all duration-500 bg-gradient-to-tr from-[#edf2f7] via-[#cbd5e1] to-[#e0e7ff] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] flex items-center justify-center px-4 py-10 font-sans">
        <div className="bg-white/70 dark:animate-gradient-dark dark:bg-white/10 dark:backdrop-blur-md backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 gap-8 p-8 md:p-12 animate-fadeInUp">
          <div className="flex justify-center items-center">
            <Skeleton className="w-40 h-40 rounded-full bg-gray-800 dark:bg-gray-200" />
          </div>
          <div className="space-y-4 text-gray-800 dark:text-white">
            <Skeleton className="w-48 h-8 bg-gray-800 dark:bg-gray-200" />
            <Skeleton className="w-full h-6 bg-gray-800 dark:bg-gray-200" />
            <Skeleton className="w-32 h-4 bg-gray-800 dark:bg-gray-200" />
            <Skeleton className="w-32 h-4 bg-gray-800 dark:bg-gray-200" />
            {location && (
              <Skeleton className="w-32 h-4 bg-gray-800 dark:bg-gray-200" />
            )}
            <div className="flex gap-4 pt-4 flex-wrap">
              {[...Array(mobileNumber.length || 2)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-24 h-4 bg-gray-800 dark:bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main UI
  return (
    <section className="transition-all duration-500 bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] grid place-items-center px-4 py-10 font-sans">
      <div className="bg-white/70 dark:animate-gradient-dark dark:bg-white/10 dark:backdrop-blur-md backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 gap-8 p-8 sm:p-10 md:p-12 animate-fadeInUp">
        {/* Left: Logo */}
        <div className="grid place-items-center w-full">
          {icon ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden p-4">
              <Image
                src={icon}
                alt={`${businessName || "Business"} logo`}
                width={400} // controls natural size
                height={200} // keeps ratio from original
                className="object-contain mx-auto"
                priority
              />
            </div>
          ) : (
            <Skeleton className="w-40 h-40 rounded-full bg-gray-800 dark:bg-gray-200" />
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-4 sm:space-y-5 text-gray-900 dark:text-white md:pl-10 md:ml-6 md:border-l-2 md:border-gray-200 dark:md:border-gray-700">
          <h1
            className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight leading-tight 
               text-gray-900 dark:text-gray-100 animate-fadeIn whitespace-normal max-w-full truncate"
          >
            {businessName}
          </h1>

          {bio?.trim() && (
            <div className="space-y-1">
              <p
                id="bio-content"
                className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed animate-fadeIn m-0"
              >
                {showFullBio ? bio : shortBio}
              </p>
              {isLong && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline transition-all"
                  aria-expanded={showFullBio}
                  aria-controls="bio-content"
                >
                  {showFullBio ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          )}

          {handlerName && (
            <p className="text-sm text-gray-700 dark:text-gray-300 animate-fadeIn">
              <span className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                Owner:
              </span>{" "}
              <span className="hover:underline cursor-pointer text-base sm:text-lg text-gray-900 dark:text-white">
                {handlerName}
              </span>
            </p>
          )}

          {gstNumber && (
            <p className="text-sm text-gray-900 dark:text-gray-300 animate-fadeIn">
              <span className="font-semibold text-gray-900 dark:text-white">
                GSTIN:
              </span>{" "}
              {gstNumber}
            </p>
          )}

          {location && (
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 animate-fadeIn">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-indigo-500 dark:text-indigo-300" />
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  location
                )}`}
                className="text-base sm:text-lg hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {location}
              </a>
            </div>
          )}

          {Array.isArray(mobileNumber) && mobileNumber.length > 0 && (
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 animate-fadeIn">
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-indigo-500 dark:text-indigo-300" />
              <span className="space-x-2 flex flex-wrap gap-2">
                {mobileNumber.map((number, index) => (
                  <a
                    key={index}
                    href={`tel:${number}`}
                    className="relative inline-block px-2 py-1 text-base sm:text-lg transition-all duration-300 transform bg-gray-100 dark:bg-gray-800 rounded-md hover:scale-105 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-lg hover:bg-white dark:hover:bg-gray-700"
                  >
                    {number}
                  </a>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(MainSection);
