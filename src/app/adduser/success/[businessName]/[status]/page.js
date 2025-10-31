"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, DocumentDuplicateIcon, ShareIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// Replace spaces with hyphen but keep Marathi characters
function createSlug(name) {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[~!@#$%^&*()_+={}[\]|\\:;"'<>,.?/]/g, "") // remove unwanted symbols
    .replace(/-+/g, "-") // collapse multiple hyphens
    .toLowerCase();
}

// 🎊 Enhanced Custom Confetti Component with better performance
const CustomConfetti = ({ count = 80, isActive = true }) => {
  const [pieces, setPieces] = useState([]);
  const colors = ["#6366F1", "#F472B6", "#FACC15", "#34D399", "#60A5FA", "#FB923C", "#EC4899", "#10B981"];

  useEffect(() => {
    if (!isActive) {
      setPieces([]);
      return;
    }

    const generated = Array.from({ length: count }).map(() => ({
      id: crypto.randomUUID(),
      size: Math.random() * 12 + 6,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: Math.random() * 360,
      shape: ["square", "circle", "triangle", "star"][Math.floor(Math.random() * 4)],
      xDrift: (Math.random() - 0.5) * 80, // wider drift for more organic feel
      yDrift: Math.random() * 50, // slight vertical variation
    }));
    setPieces(generated);

    // Auto-cleanup after animation
    const cleanupTimer = setTimeout(() => setPieces([]), 5000);
    return () => clearTimeout(cleanupTimer);
  }, [count, isActive]);

  if (!pieces.length || !isActive) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 1,
            y: -50,
            x: 0,
            rotate: p.rotate,
            scale: 1,
          }}
          animate={{
            y: "120vh",
            x: [0, p.xDrift, p.xDrift / 2, -p.xDrift / 3],
            y: ["0vh", `calc(120vh + ${p.yDrift}px)`],
            rotate: [p.rotate, p.rotate + 1080],
            opacity: [1, 0.7, 0.4, 0],
            scale: [1, 1.2, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94], // custom ease for bouncy feel
          }}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.shape === "triangle" || p.shape === "star" ? "transparent" : p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "square" ? "4px" : "0",
            clipPath:
              p.shape === "triangle"
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : p.shape === "star"
                ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                : "none",
            borderBottom: p.shape === "triangle" ? `${p.size}px solid ${p.color}` : "none",
            borderLeft: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : "none",
            borderRight: p.shape === "triangle" ? `${p.size / 2}px solid transparent` : "none",
          }}
        />
      ))}
    </div>
  );
};

// Button Component for reusability
const ActionButton = ({ children, onClick, variant = "primary", disabled = false, icon: Icon }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200
      focus:outline-none focus:ring-4 focus:ring-offset-2
      ${variant === "primary" && "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500"}
      ${variant === "secondary" && "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 focus:ring-gray-500"}
      ${variant === "whatsapp" && "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500"}
      ${disabled && "opacity-50 cursor-not-allowed"}
    `}
    aria-label={typeof children === "string" ? children : "Action button"}
  >
    {Icon && <Icon className="w-5 h-5" />}
    {children}
  </motion.button>
);

const Success = () => {
  const router = useRouter();
  const params = useParams();

  const rawBusinessName = decodeURIComponent(params?.businessName || "");
  const businessSlug = createSlug(rawBusinessName);

  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && businessSlug) {
      setCurrentUrl(`${window.location.origin}/${businessSlug}`);
    }

    // Auto-hide confetti after 6 seconds
    const confettiTimer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(confettiTimer);
  }, [businessSlug]);

  const handleGoBack = () => {
    router.push(`/${businessSlug}`);
  };

  const handleCopy = async () => {
    if (!currentUrl || copied) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!currentUrl) return;
    const message = `Hey! Check out our new site: ${currentUrl} 🚀`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden px-4 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      {/* Enhanced Animated gradient overlay with keyframes */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-400 via-pink-300 to-yellow-300 opacity-20 blur-3xl animate-gradient-flow" />
      
      {/* Custom Confetti */}
      <AnimatePresence>
        {showConfetti && <CustomConfetti count={60} isActive={showConfetti} />}
      </AnimatePresence>

      {/* Main card with improved glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 sm:p-8 text-center w-full max-w-sm mx-auto"
      >
        {/* Success Icon with pulse animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
          className="mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <CheckCircleIcon className="w-12 h-12 text-white" />
        </motion.div>

        {/* Title with staggered animation */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 leading-tight"
        >
          🎉 Congratulations, {rawBusinessName}!
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed"
        >
          Your beautiful site is now live and ready to shine! 🚀
        </motion.p>

        {/* Actions with improved spacing */}
        <div className="space-y-3">
          <ActionButton
            onClick={handleGoBack}
            variant="primary"
            icon={ArrowRightIcon}
          >
            Visit Your Site
          </ActionButton>

          <ActionButton
            onClick={handleCopy}
            variant={copied ? "whatsapp" : "secondary"}
            icon={DocumentDuplicateIcon}
            disabled={copied}
          >
            {copied ? "✅ Copied to Clipboard!" : "Copy Site URL"}
          </ActionButton>

          <ActionButton
            onClick={handleShareWhatsApp}
            variant="whatsapp"
            icon={ShareIcon}
          >
            Share on WhatsApp
          </ActionButton>
        </div>

        {/* Subtle footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 text-xs text-gray-500"
        >
          Share the excitement with your network!
        </motion.p>
      </motion.div>

      <style jsx>{`
        @keyframes gradient-flow {
          0%, 100% { transform: translateX(-20%) rotate(0deg); }
          50% { transform: translateX(20%) rotate(180deg); }
        }
        .animate-gradient-flow {
          animation: gradient-flow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Success;