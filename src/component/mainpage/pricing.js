import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PricingToggle from "./PricingToggle";
import { CheckCircle, XCircle } from "lucide-react";

const Pricing = () => {

  const prices = {
    basic: 699,
    pro: 1059,
    enterprise: 1999,
  };

  const features = {
  basic: [
    { label: "Custom Subdomain Website", allowed: true, tooltip: "Create your own branded subdomain website." },
    { label: "Up to 5 Pages", allowed: true, tooltip: "Build a website with up to 5 pages." },
    { label: "Basic SEO Tools", allowed: true, tooltip: "Optimize your site for search engines with basic tools." },
    { label: "Limited Bandwidth (5GB/month)", allowed: true, tooltip: "Monthly bandwidth limit for your website traffic." },
    { label: "24/7 Community Support", allowed: true, tooltip: "Access to community forums for help." },
    { label: "WhatsApp Sharing", allowed: false, tooltip: "Available on Pro and Enterprise plans." },
    { label: "Push Notifications", allowed: false, tooltip: "Available on Pro and Enterprise plans." },
    { label: "Email Support", allowed: false, tooltip: "Available on Pro and Enterprise plans." },
    { label: "Custom Integrations", allowed: false, tooltip: "Available on Enterprise plans only." },
    { label: "Dedicated Account Manager", allowed: false, tooltip: "Available on Enterprise plans only." },
  ],
  pro: [
    { label: "Custom Subdomain Website", allowed: true, tooltip: "Create your own branded subdomain website." },
    { label: "Up to 25 Pages", allowed: true, tooltip: "Build a website with up to 25 pages." },
    { label: "Advanced SEO Tools", allowed: true, tooltip: "Access advanced SEO optimization features." },
    { label: "Bandwidth up to 50GB/month", allowed: true, tooltip: "Higher bandwidth limits for more traffic." },
    { label: "WhatsApp Sharing", allowed: true, tooltip: "Easily share your site via WhatsApp." },
    { label: "Push Notifications", allowed: true, tooltip: "Send push notifications to your visitors." },
    { label: "Email Support", allowed: true, tooltip: "Get support via email." },
    { label: "Basic Analytics Dashboard", allowed: true, tooltip: "Track website traffic and engagement." },
    { label: "Custom Integrations", allowed: false, tooltip: "Available on Enterprise plans only." },
    { label: "Dedicated Account Manager", allowed: false, tooltip: "Available on Enterprise plans only." },
  ],
  enterprise: [
    { label: "Everything in Pro", allowed: true, tooltip: "All Pro features included." },
    { label: "Unlimited Pages", allowed: true, tooltip: "Build a website with unlimited pages." },
    { label: "Premium SEO & Marketing Tools", allowed: true, tooltip: "Advanced tools to boost your online presence." },
    { label: "Unlimited Bandwidth", allowed: true, tooltip: "No bandwidth limits for your website." },
    { label: "WhatsApp Sharing", allowed: true, tooltip: "Easily share your site via WhatsApp." },
    { label: "Push Notifications", allowed: true, tooltip: "Send push notifications to your visitors." },
    { label: "Email & Phone Support", allowed: true, tooltip: "Priority support via email and phone." },
    { label: "Dedicated Account Manager", allowed: true, tooltip: "Personalized support for your business needs." },
    { label: "Custom Integrations", allowed: true, tooltip: "Tailor integrations for your business." },
    { label: "Enterprise Analytics Dashboard", allowed: true, tooltip: "In-depth insights and reports." },
  ],
};


  const renderFeatures = (plan) =>
    features[plan].map(({ label, allowed, tooltip }) => (
      <div
        key={label}
        className={`flex items-center gap-2 cursor-help ${
          allowed
            ? "text-gray-600 dark:text-gray-300"
            : "text-gray-400 dark:text-gray-600 line-through"
        }`}
        title={tooltip}
      >
        {allowed ? (
          <CheckCircle className="w-5 h-5 text-green-500 dark:text-white" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400 dark:text-gray-400" />
        )}
        <span>{label}</span>
      </div>
    ));

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-800">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Flexible Pricing for Every Need
      </h2>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto py-10">
        {/* Basic Plan */}
       <Card className="rounded-2xl transform scale-95 opacity-90 transition-all shadow-md bg-gray-50 dark:bg-gray-700 w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              Basic
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">{renderFeatures("basic")}</div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="rounded-2xl transform scale-105 z-10 -translate-y-2 transition-all bg-gray-100 dark:bg-gray-800 shadow-xl w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 text-gray-900 dark:text-white">
            <div className="space-y-2">{renderFeatures("pro")}</div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-amber-500 text-white font-semibold">
              Start Pro
            </Button>
          </CardContent>
        </Card>
       <Card className="rounded-2xl transform scale-95 opacity-90 transition-all shadow-md bg-gray-50 dark:bg-gray-700 w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              Enterprise
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">{renderFeatures("enterprise")}</div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Pricing;
