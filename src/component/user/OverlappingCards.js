"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollCardsManual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Define transforms for each card
  const y = [
    useTransform(scrollYProgress, [0.0, 0.2], [50, 0]),
    useTransform(scrollYProgress, [0.2, 0.4], [50, 0]),
    useTransform(scrollYProgress, [0.4, 0.6], [50, 0]),
    useTransform(scrollYProgress, [0.6, 0.8], [50, 0]),
    useTransform(scrollYProgress, [0.8, 1.0], [50, 0]),
  ];

  const opacity = [
    useTransform(scrollYProgress, [0.0, 0.2], [0, 1]),
    useTransform(scrollYProgress, [0.2, 0.4], [0, 1]),
    useTransform(scrollYProgress, [0.4, 0.6], [0, 1]),
    useTransform(scrollYProgress, [0.6, 0.8], [0, 1]),
    useTransform(scrollYProgress, [0.8, 1.0], [0, 1]),
  ];

  const scale = [
    useTransform(scrollYProgress, [0.0, 0.2], [0.9, 1]),
    useTransform(scrollYProgress, [0.2, 0.4], [0.9, 1]),
    useTransform(scrollYProgress, [0.4, 0.6], [0.9, 1]),
    useTransform(scrollYProgress, [0.6, 0.8], [0.9, 1]),
    useTransform(scrollYProgress, [0.8, 1.0], [0.9, 1]),
  ];

  const cards = [
    {
      title: "आम्हाला तुमची काळजी आहे",
      text: "आम्ही फक्त उत्पादन विकत नाही, तर तुमच्या गरजा आणि अपेक्षा समजून घेऊन सेवा देतो.",
    },
    {
      title: "ग्राहकांचे मनापासून अभिप्राय",
      text: "तुम्ही नेहमीच उत्कृष्ट सेवा देता. येथे ग्राहकांची खरी काळजी घेतली जाते.",
    },
    {
      title: "तुमच्यासाठी खास सेवा",
      text: "तुमच्या गरजेनुसार योग्य सल्ला आणि उत्तम उत्पादने देण्यासाठी आम्ही तयार आहोत.",
    },
    {
      title: "सर्वोत्तम ग्राहक अनुभव",
      text: "प्रत्येक वेळी तुम्ही आमच्या सेवेचा आनंद घ्यावा, यासाठी आम्ही प्रयत्नशील असतो.",
    },
    {
      title: "तुमच्या सेवेत सदैव तत्पर",
      text: "आम्ही तुमच्यासाठी नेहमीच हजर आहोत. आमच्या समाधानी ग्राहकांचा भाग बना.",
    },
  ];

  return (
    <div
      ref={ref}
      className="relative w-full mt-20 px-4 backdrop-blur-md bg-white/30 rounded-xl py-10"
      style={{ height: "2000px" }}
    >
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-10">ग्राहक अनुभव</h1>

      {cards.map((card, index) => (
        <motion.div
          key={index}
          style={{
            position: "sticky",
            top: 60 * index,
            y: y[index],
            opacity: opacity[index],
            scale: scale[index],
          }}
          className="bg-white text-black dark:bg-gray-700 dark:text-white p-8 rounded-lg shadow-lg mb-20"
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
          <p className="text-lg">{card.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
