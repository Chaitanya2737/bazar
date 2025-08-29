"use client"
import React, { useState } from 'react'

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar, { SupportNavForLaptop } from "@/component/navBar/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState("vision");

  const sections = [
    {
      id: "vision",
      title: "Our Vision (आपली दृष्टी)",
      text: "Empowering small and medium businesses with advanced digital tools, making website creation easy, expanding customer reach, and enabling smart local marketing through one intuitive platform.",
      img: "/about-us/20943892.jpg",
    },
    {
      id: "mission",
      title: "Our Mission (आपले ध्येय)",
      text: "To simplify digital growth for small and medium businesses. Our platform allows businesses to build websites, run campaigns via SMS and WhatsApp, and manage Instagram & Facebook ads—all under one roof—while engaging customers with personalized push notifications, without any technical expertise.",
      img: "/about-us/20062.jpg",
    },
  ];

  const values = [
    {
      title: "Innovation",
      description:
        "Constantly evolving our platform with cutting-edge technology",
      icon: "💡",
    },
    {
      title: "Accessibility",
      description: "Making digital tools available to businesses of all sizes",
      icon: "🌐",
    },
    {
      title: "Empowerment",
      description: "Enabling businesses to grow through our solutions",
      icon: "🚀",
    },
    {
      title: "Support",
      description: "Providing exceptional customer service and guidance",
      icon: "🤝",
    },
  ];

  return (
    <>
      <Navbar />
      <SupportNavForLaptop />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        {/* Tabs */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-full p-1.5 shadow-xl border border-gray-100 dark:border-gray-800">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                    activeTab === section.id
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  aria-selected={activeTab === section.id}
                  role="tab"
                >
                  {section.title.split(" (")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 gap-12 lg:gap-16 mb-20">
            {sections.map(({ id, title, text, img }, idx) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                  activeTab !== id ? "hidden" : ""
                } ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Text */}
                <div className="flex-1 space-y-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-500 dark:to-indigo-500">
                    {title}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-200 leading-relaxed font-medium">
                    {text}
                  </p>
                </div>

                {/* Image */}
                <div className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
                  <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-500 dark:to-indigo-500">
              Our Values
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map(({ title, description, icon }) => (
                <div
                  key={title}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-800"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsPage;
