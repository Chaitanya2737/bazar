"use client";
import Lottie from "lottie-react";
import planeAnimation from "@/assets/Loading 40 _ Paperplane.json";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <Lottie animationData={planeAnimation} loop={true} autoplay={true} />
    </div>
  );
};

export default Loader;
