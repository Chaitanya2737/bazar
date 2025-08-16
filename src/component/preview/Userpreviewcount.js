import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useRef, useState } from "react";

const AnimatedCount = ({ target }) => {
  const [count, setCount] = useState(0);
  const frame = useRef();

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      setCount(current);

      if (progress < 1) {
        frame.current = requestAnimationFrame(animate);
      }
    };

    frame.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame.current);
  }, [target]);

  return (
    <div className="w-20 h-20 rounded-full bg-[#161212] dark:bg-gray-700 flex flex-col items-center justify-center shadow-xl text-center p-2">
      <span className="text-white text-xl font-bold leading-none">{count}</span>
      <p className="text-[10px] text-gray-400 leading-tight">Visited users</p>
    </div>
  );
};

const UserPreviewCount = ({ count }) => {
  const [show, setShow] = useState(true);
  const isValid = typeof count === "number";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      setShow(scrollY >= screenHeight);
    };
    

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isValid ? (
        <AnimatedCount target={count} />
      ) : (
        <Skeleton className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
};

export default UserPreviewCount;
