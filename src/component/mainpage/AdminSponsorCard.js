import { ShieldCheck, HandCoins, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: <ShieldCheck className="text-blue-950 dark:text-blue-300 w-6 h-6" />,
    title: "Admin-Only Control",
    desc: "Only the admin has access to create & manage users — ensuring tighter control and accountability.",
  },
  {
    icon: <HandCoins className="text-green-950 dark:text-green-300 w-6 h-6" />,
    title: "No Bulk Payments",
    desc: "We don’t force you into 10-user plans. Use our flexible pay-as-you-go model — scale only when you're ready.",
  },
  {
    icon: <Zap className="text-yellow-950 dark:text-yellow-300 w-6 h-6" />,
    title: "Instant Setup",
    desc: "No waiting or manual delays. Once your admin is active, you're good to go — fast and frictionless.",
  },
  {
    icon: <Users className="text-purple-950 dark:text-purple-300 w-6 h-6" />,
    title: "Transparent Pricing",
    desc: "Admin setup starts from ₹2500 – ₹3500. No hidden fees, no surprises. Just clear value.",
  },
];

export default function AdminInfoPro() {
  return (
    <>
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-orange-500 mb-6 text-center tracking-tight">
          Admin Features & Benefits
        </h2>
      </div>

      <section className="relative bg-gradient-to-br from-[#F0F9FF] via-white to-[#F0F9FF] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 sm:p-10 lg:p-12 overflow-hidden border border-blue-100 dark:border-gray-700 max-w-5xl mx-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-blue-950">
          {FEATURES.map((feature) => (
            <FeatureBox key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg">Get Started Now</Button>
        </div>

        <p className="mt-8 text-center text-gray-700 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Skip overpriced platforms. Choose smart control, real flexibility, and
          transparent pricing.
        </p>
      </section>
    </>
  );
}

function FeatureBox({ icon, title, desc }) {
  return (
    <Card className="p-5 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-lg focus-within:shadow-lg transition-all duration-200 group">
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center rounded-full bg-blue-50 dark:bg-gray-700 p-2 group-hover:bg-blue-100 dark:group-hover:bg-gray-600 transition">
          {icon}
        </span>
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {desc}
      </p>
    </Card>
  );
}
