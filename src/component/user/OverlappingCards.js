"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function useCardTransforms(scrollYProgress, index, total) {
  const rangeSize = 1 / total;
  const start = index * rangeSize;
  const end = start + rangeSize;

  const y = useTransform(scrollYProgress, [start, end], [50, 0], { clamp: true });
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1], { clamp: true });
  const scale = useTransform(scrollYProgress, [start, end], [0.9, 1], { clamp: true });

  return { y, opacity, scale };
}

export default function ScrollCards() {
  const totalCards = 5;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

 const cardsContent = [
  {
    title: "आम्हाला तुमची काळजी आहे",
    description:
      "आम्ही फक्त उत्पादन विकत नाही, तर तुमच्या गरजा आणि अपेक्षा समजून घेऊन त्यानुसार सेवा देतो. तुमची समाधान ही आमची प्रेरणा आहे.",
  },
  {
    title: "ग्राहकांचा अनुभव",
    description:
      "“मी खूप काळापासून या दुकानाचा ग्राहक आहे. येथे नेहमीच वेळेवर मदत मिळते आणि उत्पादनांचा दर्जा अप्रतिम आहे.”",

  },
  {
    title: "तुमच्यासाठी खास सेवा",
    description:
      "तुमच्या गरजेनुसार योग्य सल्ला आणि उत्तम उत्पादने देण्यासाठी आम्ही सदैव तयार आहोत. तुमचा अनुभव आमच्यासाठी महत्त्वाचा आहे.",
    
  },
  {
    title: "ग्राहकांचे मनापासून अभिप्राय",
    description:
      "“तुम्ही नेहमीच उत्कृष्ट सेवा देता. मला खूप आवडते की येथे ग्राहकांना खरी काळजी घेतली जाते.”",

  },
  {
    title: "तुमच्या सेवेत सदैव तत्पर",
    description:
      "आम्ही तुमच्यासाठी नेहमीच हजर आहोत. आमच्या सेवा वापरून बघा आणि आमच्या समाधानी ग्राहकांचा भाग बना.",
 
  },
];


  return (
    <div
      ref={ref}
      className="relative w-full mt-20 px-4"
      style={{ height: `${totalCards * 400}px`, perspective: 1000 }}
    >

      <h1 className="text-3xl text-gray-800 sm:text-4xl font-bold  mb-6  ">Client Success Stories</h1>
      {cardsContent.map((card, index) => {
        const { y, opacity, scale } = useCardTransforms(scrollYProgress, index, totalCards);
        return (
          <motion.div
            key={index}
            style={{
              position: "sticky",
              top: 60 + index * 95,
              y,
              opacity,
              scale,
              color: card.color || "#111",
              minHeight: 220,
              borderRadius: 12,
              boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
              padding: 32,
              textAlign: "center",
              marginBottom: 30,
              zIndex: index,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
              className="bg-white dark:bg-gray-500 text-black dark:text-white"

            transition={{ type: "spring", stiffness: 150, damping: 30 }}
            whileHover={{ boxShadow: "0 8px 25px rgba(0,0,0,0.35)" }}
          >
            <h2 className="text-2xl font-bold mb-4">{card.title}</h2>
            <p className="mb-6 text-lg leading-relaxed">{card.description}</p>

            {card.customerName && (
              <div className="flex items-center justify-center gap-4 mt-auto">
              
                <div className="text-left">
      
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
