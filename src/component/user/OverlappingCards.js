"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import axios from "axios";

const cards = [
  {
    title: "आम्हाला तुमची काळजी आहे",
    description:
      "आम्ही फक्त उत्पादन विकत नाही, तर तुमच्या गरजा आणि अपेक्षा समजून घेऊन सेवा देतो.",
  },
  {
    title: "ग्राहकांचे मनापासून अभिप्राय",
    description:
      "तुम्ही नेहमीच उत्कृष्ट सेवा देता. येथे ग्राहकांची खरी काळजी घेतली जाते.",
  },
  {
    title: "तुमच्यासाठी खास सेवा",
    description:
      "तुमच्या गरजेनुसार योग्य सल्ला आणि उत्तम उत्पादने देण्यासाठी आम्ही तयार आहोत.",
  },
  {
    title: "सर्वोत्तम ग्राहक अनुभव",
    description:
      "प्रत्येक वेळी तुम्ही आमच्या सेवेचा आनंद घ्यावा, यासाठी आम्ही प्रयत्नशील असतो.",
  },
  {
    title: "तुमच्या सेवेत सदैव तत्पर",
    description:
      "आम्ही तुमच्यासाठी नेहमीच हजर आहोत. आमच्या समाधानी ग्राहकांचा भाग बना.",
  },
];

export default function ScrollCardsManual({ reviewId }) {
  const ref = useRef(null);
  const [review, setReview] = useState(cards);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

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
    useTransform(scrollYProgress, [0.0, 0.2], [0.95, 1]),
    useTransform(scrollYProgress, [0.2, 0.4], [0.95, 1]),
    useTransform(scrollYProgress, [0.4, 0.6], [0.95, 1]),
    useTransform(scrollYProgress, [0.6, 0.8], [0.95, 1]),
    useTransform(scrollYProgress, [0.8, 1.0], [0.95, 1]),
  ];

  const fetchReview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/user/review/preview/", {
        ReviewId: reviewId,
      });
      if (response.data.success) {
        setReview(response.data.review.reviews || cards);
      } else {
        setReview(cards);
        setError(response.data.message || "Failed to fetch review");
      }
    } catch (err) {
      console.error(err);
      setReview(cards);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviewId) fetchReview();
  }, [reviewId]);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8 backdrop-blur-xl bg-white/20 dark:bg-gray-900/20  dark:text-white rounded-3xl py-16 min-h-screen"
    >


      {loading && (
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 animate-pulse mb-8">
          Loading...
        </p>
      )}
      {error && (
        <p className="text-center text-lg text-red-500 dark:text-red-400 font-medium mb-8">
          {error}
        </p>
      )}

      {review.map((card, index) => (
        <motion.div
          key={index}
          style={{
            position: "sticky",
            top: 90 * index + 120,
            y: y[index * 10],
            opacity: opacity[index * 10],
            scale: scale[10],
          }}
          className="bg-white dark:bg-gray-800/90 text-gray-800 dark:text-white p-8 sm:p-10 rounded-xl shadow-xl border  border-amber-950/25 dark:border-gray-700 mb-20 max-w-7xl mx-auto hover:shadow-2xl transition-shadow duration-100 cursor-pointer"
          transition={{ type: "spring", stiffness: 120 }}
          whileHover={{ scale: 1.04 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {card.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {card.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
