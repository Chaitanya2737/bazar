import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Animated counter
const AnimatedCount = ({ target, duration = 800 }) => {
  const [count, setCount] = useState(0);
  const frame = useRef();
  const startTime = useRef();

  useEffect(() => {
    const animate = (time) => {
      if (!startTime.current) startTime.current = time;
      const progress = Math.min((time - startTime.current) / duration, 1);
      const current = Math.floor(progress * target);
      setCount(current);

      if (progress < 1) {
        frame.current = requestAnimationFrame(animate);
      }
    };

    frame.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return (
    <div className="w-20 h-20 rounded-full bg-gray-900 dark:bg-white dark:text-black flex flex-col items-center justify-center shadow-xl p-2 text-center">
      <span className="text-white text-xl font-bold dark:bg-white dark:text-black ">{count}</span>
      <p className="text-[10px] text-gray-400">Visited users</p>
    </div>
  );
};

// User preview count badge
const UserPreviewCount = ({ count }) => {
  const [visible, setVisible] = useState(false);
  const isValid = typeof count === "number";

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY >= window.innerHeight);
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // trigger on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isValid ? (
        <AnimatedCount target={count} />
      ) : (
        <Skeleton className="w-16 h-16 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default UserPreviewCount;
