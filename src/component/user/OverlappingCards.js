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
      title: "Div 1",
      description: "This is the content of the first div.",
   
    },
    {
      title: "Div 2",
      description: "Here goes the content for the second div.",
     
    },
    {
      title: "Div 3",
      description: "Third div has some interesting content here.",
   
    },
    {
      title: "Div 4",
      description: "This is the fourth div's content.",
 
    },
    {
      title: "Div 5",
      description: "Finally, the fifth div content is shown here.",
    
    },
  ];

  return (
    <div
      ref={ref}
      className="relative w-full mt-20 px-4"
      style={{ height: `${totalCards * 400}px`, perspective: 1000 }}
    >
      {/* Manually create 5 divs */}
      <motion.div
        style={{
          position: "sticky",
          top: 50,
          y: useCardTransforms(scrollYProgress, 0, totalCards).y,
          opacity: useCardTransforms(scrollYProgress, 0, totalCards).opacity,
          scale: useCardTransforms(scrollYProgress, 0, totalCards).scale,
          backgroundColor: cardsContent[0].bgColor,
          minHeight: 200,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          padding: 32,
          textAlign: "center",
          marginBottom: 30,
          zIndex: 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 30 }}
        whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}
      >
        <h2 className="text-2xl font-bold mb-4">{cardsContent[0].title}</h2>
        <p>{cardsContent[0].description}</p>
      </motion.div>

      <motion.div
        style={{
          position: "sticky",
          top: 130,
          y: useCardTransforms(scrollYProgress, 1, totalCards).y,
          opacity: useCardTransforms(scrollYProgress, 1, totalCards).opacity,
          scale: useCardTransforms(scrollYProgress, 1, totalCards).scale,
          backgroundColor: cardsContent[1].bgColor,
          minHeight: 200,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          padding: 32,
          textAlign: "center",
          marginBottom: 30,
          zIndex: 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 30 }}
        whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}
      >
        <h2 className="text-2xl font-bold mb-4">{cardsContent[1].title}</h2>
        <p>{cardsContent[1].description}</p>
      </motion.div>

      <motion.div
        style={{
          position: "sticky",
          top: 200,
          y: useCardTransforms(scrollYProgress, 2, totalCards).y,
          opacity: useCardTransforms(scrollYProgress, 2, totalCards).opacity,
          scale: useCardTransforms(scrollYProgress, 2, totalCards).scale,
          backgroundColor: cardsContent[2].bgColor,
          minHeight: 200,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          padding: 32,
          textAlign: "center",
          marginBottom: 30,
          zIndex: 2,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 30 }}
        whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}
      >
        <h2 className="text-2xl font-bold mb-4">{cardsContent[2].title}</h2>
        <p>{cardsContent[2].description}</p>
      </motion.div>

      <motion.div
        style={{
          position: "sticky",
          top: 300,
          y: useCardTransforms(scrollYProgress, 3, totalCards).y,
          opacity: useCardTransforms(scrollYProgress, 3, totalCards).opacity,
          scale: useCardTransforms(scrollYProgress, 3, totalCards).scale,
          backgroundColor: cardsContent[3].bgColor,
          minHeight: 200,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          padding: 32,
          textAlign: "center",
          marginBottom: 30,
          zIndex: 3,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 30 }}
        whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}
      >
        <h2 className="text-2xl font-bold mb-4">{cardsContent[3].title}</h2>
        <p>{cardsContent[3].description}</p>
      </motion.div>

      {/* <motion.div
        style={{
          position: "sticky",
          top: 290,
          y: useCardTransforms(scrollYProgress, 4, totalCards).y,
          opacity: useCardTransforms(scrollYProgress, 4, totalCards).opacity,
          scale: useCardTransforms(scrollYProgress, 4, totalCards).scale,
          backgroundColor: cardsContent[4].bgColor,
          minHeight: 200,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          padding: 32,
          textAlign: "center",
          marginBottom: 30,
          zIndex: 4,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 30 }}
        whileHover={{ boxShadow: "0 8px 20px rgba(0,0,0,0.35)" }}
      >
        <h2 className="text-2xl font-bold mb-4">{cardsContent[4].title}</h2>
        <p>{cardsContent[4].description}</p>
      </motion.div> */}
    </div>
  );
}
