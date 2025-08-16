import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const PreviewOffer = ({ userId }) => {
  const [offer, setOffer] = useState(null);

  const fetchOffer = async () => {
    try {
      const response = await axios.post("/api/user/siteoffer/preview", { userId });
      setOffer(response.data.offer); // store only the offer object
    } catch (error) {
      console.error("Error fetching offer:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchOffer();
    }
  }, [userId]);

  if (!offer) return

  return (
    <div className="flex items-center bg-yellow-100 dark:bg-yellow-400 p-2 my-3 rounded-lg shadow-md gap-3">
      {/* Special Offer Logo — drop from top + blink */}
      <motion.div
        initial={{ y: -50, opacity: 0 }} // start above
        animate={{
          y: 0,
          opacity: [0, 1, 0.4, 1], // blinking effect
          scale: [0.95, 1, 1.05, 1], // pop effect
        }}
        transition={{
          y: { type: "spring", stiffness: 120, damping: 10 }, // smooth drop
          opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }, // blinking
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Image
          src="/yellow-paper-note-with-text-special-offer-D38FDP.jpg"
          height={10}
          width={40}
          alt="Special Offer"
          className="rounded-lg border border-yellow-500 shadow"
        />
      </motion.div>

      {/* Scrolling Offer Text */}
      <div className="overflow-hidden whitespace-nowrap text-black flex-1">
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 50,
            ease: "linear",
          }}
          className="inline-block text-lg font-semibold text-black"
        >
          <span className="mr-10">{offer.title}</span>
          <span className="mr-10">{offer.title}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PreviewOffer;
