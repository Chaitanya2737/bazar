"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { FaWhatsapp, FaInstagram, FaFacebook, FaGoogle } from "react-icons/fa";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroMarketing = () => {
  const router = useRouter();

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] dark:from-gray-900 dark:to-gray-800 py-12">
      {/* Tagline */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <span className="text-orange-500 text-lg">📈</span>
        <span className="font-semibold text-base">BazarHub</span>
        <span className="text-xs">Marketing made easy</span>
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
        Promote your{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          business
        </span>
        <br />
        <span className="text-blue-600 dark:text-yellow-400">like a pro.</span>
      </h1>

      {/* Subheading */}
      <p className="max-w-2xl text-lg text-gray-700 dark:text-gray-300 mb-8">
        Run Meta Ads, Send Push Notifications, Connect via WhatsApp & SMS, and
        boost your visibility — all from one platform.
      </p>

      {/* Marketing Channels */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl w-full">
        <div
          onClick={() => router.push("/user/marketing/whatapp")}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-xl transition-all">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <FaWhatsapp size={30} className="text-green-500 mb-2" />
              <p className="font-medium">WhatsApp</p>
            </CardContent>
          </Card>
        </div>

        <div
          onClick={() => router.push("/user/marketing/instagram")}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-xl transition-all">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <FaInstagram size={30} className="text-pink-500 mb-2" />
              <p className="font-medium">Instagram</p>
            </CardContent>
          </Card>
        </div>

        <div
          onClick={() => router.push("/user/marketing/facebook")}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-xl transition-all">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <FaFacebook size={30} className="text-blue-600 mb-2" />
              <p className="font-medium">Facebook</p>
            </CardContent>
          </Card>
        </div>

        <div
          onClick={() => router.push("/user/marketing/push-notification")}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-xl transition-all">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Bell size={28} className="text-yellow-500 mb-2" />
              <p className="font-medium">Push</p>
            </CardContent>
          </Card>
        </div>

        <div
          onClick={() => router.push("/user/marketing/google")}
          className="cursor-pointer"
        >
          <Card className="hover:shadow-xl transition-all">
            <CardContent className="flex flex-col items-center justify-center p-4">
              <FaGoogle size={30} className="text-red-500 mb-2" />
              <p className="font-medium">Google</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroMarketing;
