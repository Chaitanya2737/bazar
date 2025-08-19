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
    <div className="flex items-center text-white bg-slate-800 dark:bg-fuchsia-300/50 dark:text-neutral-900 p-2 my-3 rounded-lg shadow-md gap-3 ">
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
          src="/f869f0b2dd2ab59a33d10c8f97856251.jpg"
          height={20}
          width={50}
          alt="Special Offer"
          className="rounded-lg border border-cyan-900 shadow"
        />
      </motion.div>

      {/* Scrolling Offer Text */}
      <div className="overflow-hidden whitespace-nowrap  flex-1">
        <motion.div
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 50,
            ease: "linear",
          }}
          className="inline-block text-lg font-semibold text-white"
        >
          <span className="mr-10">{offer.title}</span>
          <span className="mr-10">{offer.title}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PreviewOffer;
