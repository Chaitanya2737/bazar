import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Phone, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import "../../../src/app/globals.css";

const MainSection = ({
  businessName,
  icon,
  mobileNumber = [],
  bio,
  email,
  handlerName,
  socialMediaLinks = [],
  location,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading completion after 2 seconds (replace with your actual data fetching logic)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer); // Clean up the timer when the component is unmounted
  }, []);

  if (loading) {
    return (
      <section className="transition-all duration-500 bg-gradient-to-tr from-[#edf2f7] via-[#cbd5e1] to-[#e0e7ff] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] flex items-center justify-center px-4 py-10 font-sans">
        <div className="bg-white/70 dark:animate-gradient-dark dark:bg-white/10 dark:backdrop-blur-md backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 gap-8 p-8 md:p-12 transition-colors duration-500 animate-fadeInUp">
          {/* Left: Logo */}
          <div className="flex justify-center items-center">
            <Skeleton className="w-40 h-40 rounded-full bg-gray-800 dark:bg-gray-200" />
          </div>

          {/* Right: Info */}
          <div className="space-y-4 text-gray-800 dark:text-white">
            <Skeleton className="w-48 h-8 bg-gray-800 dark:bg-gray-200" />
            <Skeleton className="w-full h-6 bg-gray-800 dark:bg-gray-200" />

            <Skeleton className="w-32 h-4 bg-gray-800 dark:bg-gray-200" />

            <Skeleton className="w-32 h-4 bg-gray-800 dark:bg-gray-200" />

            <div className="flex gap-4 pt-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="w-24 h-4 bg-gray-800 dark:bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="transition-all duration-500 bg-gradient-to-tr from-[#edf2f7] via-[#cbd5e1] to-[#e0e7ff] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] flex items-center justify-center px-4 py-10 font-sans">
      <div className="bg-white/70 dark:animate-gradient-dark dark:bg-white/10 dark:backdrop-blur-md backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 gap-8 p-8 md:p-12 transition-colors duration-500 animate-fadeInUp">
        {/* Left: Logo */}
        <div className="flex justify-center items-center">
          {icon ? (
            <Image
              src={icon}
              alt={`${businessName} logo`}
              width={160}
              height={160}
              priority
              className="rounded-full shadow-lg border-4 border-white dark:border-slate-700"
            />
          ) : (
            <Skeleton className="w-40 h-40 rounded-full bg-gray-800 dark:bg-gray-200" />
          )}
        </div>

        {/* Right: Info */}
        <div className="space-y-4 text-gray-800 dark:text-white">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {businessName ? (
              businessName
            ) : (
              <Skeleton className="w-48 h-8 bg-gray-800 dark:bg-gray-200" />
            )}
          </h1>

          {bio && (
            <div className="text-gray-600 dark:text-gray-300 text-md leading-relaxed">
              {bio ? (
                bio
              ) : (
                <Skeleton className="w-full h-6 bg-gray-800 dark:bg-gray-200" />
              )}
            </div>
          )}

          {/* Mobile Numbers */}
          {mobileNumber.length > 0 ? (
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Phone className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-300" />
              <span>
                {mobileNumber.map((number, index) => (
                  <span key={index}>
                    {number}
                    {index < mobileNumber.length - 1 && " | "}
                  </span>
                ))}
              </span>
            </div>
          ) : (
            <Skeleton className="w-32 h-4 bg-gray-800 dark:bg-gray-200" />
          )}

          {/* Location */}
          {location ? (
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-pink-500 dark:text-pink-300" />
              <span>{location}</span>
            </div>
          ) : (
            <Skeleton className="w-32 h-4 bg-gray-800 dark:bg-gray-200" />
          )}

          {/* Social Media Links */}
          {socialMediaLinks.length > 0 ? (
            <div className="flex gap-4 pt-4">
              {socialMediaLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline hover:text-indigo-800 dark:hover:text-indigo-100 transition"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          ) : (
            <div className="flex gap-4 pt-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="w-24 h-4 bg-gray-800 dark:bg-gray-200" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainSection;
