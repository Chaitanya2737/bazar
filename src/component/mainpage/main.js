// app/page.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@radix-ui/react-switch";
import { ArrowRight, Globe, MessageSquare, Bell } from "lucide-react";
import Head from "next/head";
import { useState } from "react";
import PricingToggle from "./PricingToggle";

export default function Maincomp() {

  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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
          Build Your Digital Presence with Ease
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Get your custom subdomain packed with tools like WhatsApp offer sharing, push notifications, and more to grow your business.
        </p>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Powerful Features for Your Business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center text-gray-900 dark:text-white">
                <Globe className="mr-2 h-6 w-6 text-blue-600" />
                Custom Subdomains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Get a personalized subdomain for your business, fully customizable and ready to go live in minutes.
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
                Share promotions and offers directly with customers on WhatsApp for instant engagement.
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
                Keep customers informed with real-time updates via FCM-powered push notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-2xl font-bold text-blue-600">1</span>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Sign Up:</strong> Create an account and choose your unique subdomain.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-2xl font-bold text-blue-600">2</span>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Customize:</strong> Set up your site with our easy-to-use tools and integrate features like WhatsApp and notifications.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span className="text-2xl font-bold text-blue-600">3</span>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Launch:</strong> Go live and start engaging customers with your digital platform.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Launch Your Digital Business?
        </h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Join our platform and unlock powerful tools to connect with your customers like never before.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
        >
          Get Your Subdomain Now
        </Button>
      </section>
      {/* Pricing Section */}
<section className="py-20 px-4 bg-white dark:bg-gray-800">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
    Flexible Pricing for Every Need
  </h2>

  {/* Toggle */}
  <PricingToggle isYearly={isYearly} setIsYearly={setIsYearly} className="mb-12" />

  {/* Pricing Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {/* Basic Plan */}
    <Card className="shadow-md bg-gray-50 dark:bg-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
          Basic
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-4xl font-bold text-blue-600">$0</p>
        <ul className="text-gray-600 dark:text-gray-300 space-y-2">
          <li>✔️ Custom Subdomain</li>
          <li>✔️ WhatsApp Sharing</li>
          <li>✖️ Push Notifications</li>
        </ul>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Get Started
        </Button>
      </CardContent>
    </Card>

    {/* Pro Plan */}
    <Card className="shadow-lg border-2 border-blue-600 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
          Pro
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-4xl font-bold text-blue-600">
          {isYearly ? "$190/yr" : "$19/mo"}
        </p>
        <ul className="text-gray-600 dark:text-gray-300 space-y-2">
          <li>✔️ Custom Subdomain</li>
          <li>✔️ WhatsApp Sharing</li>
          <li>✔️ Push Notifications</li>
          <li>✔️ Email Support</li>
        </ul>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {isYearly ? "Start Yearly" : "Start Pro"}
        </Button>
      </CardContent>
    </Card>

    {/* Enterprise Plan */}
    <Card className="shadow-md bg-gray-50 dark:bg-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
          Enterprise
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-4xl font-bold text-blue-600">Custom</p>
        <ul className="text-gray-600 dark:text-gray-300 space-y-2">
          <li>✔️ Everything in Pro</li>
          <li>✔️ Custom Integrations</li>
          <li>✔️ Dedicated Support</li>
        </ul>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Contact Sales
        </Button>
      </CardContent>
    </Card>
  </div>
</section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
        <p>© 2025 Your Digital Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}