// app/page.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Globe,
  MessageSquare,
  Bell,
  Instagram,
} from "lucide-react";
import Head from "next/head";
import ChatApp from "./ChatApp";
import AdminSponsorCard from "./AdminSponsorCard";
import Pricing from "./pricing";
import Testimonials from "./Testimonials";
import Footer from "../user/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Maincomp() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 rounded-2xl shadow-lg ">
      <Head>
        <title>Your Digital Platform - Custom Subdomains & More</title>
        <meta
          name="description"
          content="Create your own subdomain with powerful features like WhatsApp offer sharing and push notifications."
        />
      </Head>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Create Your Digital{" "}
          <span className="text-blue-600 text-6xl dark:text-orange-500 tracking-wide">
            Footprint
          </span>{" "}
          Seamlessly
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-5xl mx-auto">
          Get your own branded subdomain complete with WhatsApp promotions, push
          notifications, and a powerful suite of marketing tools designed to
          help grow your business fast. Increase customer engagement, boost
          sales, and expand your online presence with easy-to-use features
          tailored for small businesses and entrepreneurs
        </p>
        <Button
          size="lg"
          className="bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 hover:cursor-pointer text-white transform transition duration-300 ease-in-out hover:scale-105 shadow-lg"
        >
          Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 ">
          Powerful Features for Your Business{" "}
          <span className="text-blue-600 dark:text-orange-500">
            || marketing tools for business
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                <Instagram className="mr-2 h-6 w-6 text-blue-600" />
                Instagram Ads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Boost Your Product Visibility and Sales with Facebook &
                Instagram Ads
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                <MessageSquare className="mr-2 h-6 w-6 text-blue-600" />
                WhatsApp Offer Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Share promotions and offers directly with customers on WhatsApp
                for instant engagement.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                <Bell className="mr-2 h-6 w-6 text-blue-600" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Keep customers informed with real-time updates via FCM-powered
                push notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-300/20 shadow-2xl rounded-md mt-10 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center text-center">
          <div className="container p-5 text-center md:text-left dark:text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              Check out our recent client
            </h1>
            <p className="text-gray-700 mb-5 dark:text-gray-300">
              We take pride in delivering top-notch solutions to our clients.
              See how we helped our recent client achieve their goals with our
              expertise and support.
            </p>
            <Button
              size="lg"
              onClick={() => router.push("/map")}
              className="text-center bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 dark:hover:bg-orange-600 text-white px-8 py-3 rounded-lg transform transition duration-300 ease-in-out hover:scale-105 shadow-lg"
            >
              let&lsquo;s find
            </Button>
          </div>

          <div className="relative w-full sm:w-[24rem] md:w-[32rem] h-60 sm:h-72 md:h-96 rounded-lg overflow-hidden mx-auto">
            <Image
              src="/pexels-arthousestudio-4338093.jpg"
              alt="Recent client image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900  ">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How It Works
        </h2>
        <ChatApp />
      </section>

      <section>
        <Pricing />
      </section>
      <section className="py-16 px-4">
        <AdminSponsorCard />
      </section>

      {/* offer section  */}
      {/* Pricing Section */}

      <section>
        <Testimonials />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
