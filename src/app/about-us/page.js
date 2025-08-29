"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar, { SupportNavForLaptop } from "@/component/navBar/page";
import Head from "next/head";

const Page = () => {
  const [activeTab, setActiveTab] = useState("vision");

  const sections = [
    {
      id: "vision",
      title: "Our Vision (आपली दृष्टी)",
      text: "प्रत्येक लहान आणि मध्यम उद्योगाला अत्याधुनिक डिजिटल साधनांनी सक्षम करणे, ज्यामुळे वेबसाइट तयार करणे सोपे होते, ग्राहकांपर्यंत पोहोच वाढते आणि स्मार्ट, स्थानिक मार्केटिंगद्वारे वाढ साधता येते — हे सर्व एका प्रभावी, वापरण्यास सोप्या प्लॅटफॉर्मवर.",
      img: "/about-us/20943892.jpg",
    },
    {
      id: "mission",
      title: "Our Mission (आपले ध्येय)",
      text: "लहान आणि मध्यम उद्योगांसाठी डिजिटल वाढ सुलभ करणे हे आमचे ध्येय आहे. आम्ही असा एकत्रित प्लॅटफॉर्म देतो ज्यावर ते वेबसाइट तयार करू शकतात, एसएमएस, व्हॉट्सअ‍ॅपद्वारे मोहिमा चालवू शकतात, तसेच इंस्टाग्राम जाहिराती, फेसबुक जाहिराती आणि इतर डिजिटल मार्केटिंग सेवा—हे सर्व एकाच छताखाली—सुलभपणे व्यवस्थापित करू शकतात. याशिवाय, वैयक्तिकृत पुश नोटिफिकेशन्सद्वारे ग्राहकांशी प्रभावी संवाद साधता येतो—आणि हे सर्व कोणत्याही तांत्रिक कौशल्याशिवाय.",
      img: "/about-us/20062.jpg",
    },
  ];

  const team = [
    {
      name: "Vinayak Satarkar",
      role: "Founder & Owner",
      img: "/about-us/20062.jpg",
      bio: "Passionate entrepreneur with expertise in digital solutions and a mission to empower small businesses globally.",
      social: { linkedin: "#", twitter: "#", email: "#" },
    },
    {
      name: "Chaitanya Satarkar",
      role: "Lead Developer",
      img: "/about-us/IMG-20230402-WA0006(1) (1).jpg",
      bio: "Full Stack Developer specializing in MERN stack and scalable web applications, ensuring smooth user experiences.",
      social: { linkedin: "#", github: "#", email: "#" },
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

const phoneNumber = "918421679469"; // Country code + number, no spaces
const message = "Hi, I want franchise details"; // Optional preset message

const handleClick = () => {
  window.open(
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );
};


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
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9 }}
                  viewport={{ once: true }}
                  className="relative w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform duration-500"
                >
                  <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-500 dark:to-indigo-500">
              Our Values
            </h2>

            {/* Business Plan Image */}

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map(({ title, description, icon }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-800"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <div className="p-4 sm:p-6 lg:p-12 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-500 dark:to-indigo-500"
            >
              Meet Our Team
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {team.map(({ name, role, img, bio }) => (
                <motion.div
                  key={name}
                  initial={{ y: 60, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9 }}
                  viewport={{ once: true }}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-500 border border-gray-100 dark:border-gray-800"
                >
                  {/* Avatar */}
                  <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden shadow-lg ring-4 ring-blue-200 dark:ring-gray-700 hover:ring-blue-400 dark:hover:ring-gray-600 transition-all duration-300">
                    <Image
                      src={img}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>

                  {/* Name + Role */}
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {name}
                  </h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3 text-sm">
                    {role}
                  </p>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Franchise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative text-center py-16 px-6 sm:px-10 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl text-white shadow-2xl mx-4 sm:mx-6 lg:mx-8 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
            />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-md">
                Become a Franchise Partner 🚀
              </h2>
              <p className="text-base sm:text-lg lg:text-xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
                Unlock exciting opportunities by partnering with us. As a
                franchise owner, you’ll get access to our proven platform,
                training, and marketing support to grow your business under one
                trusted brand.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClick}
                  className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  Get Franchise Details
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Page;