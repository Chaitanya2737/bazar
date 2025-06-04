import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Crown, TrendingUp, Settings, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSponsorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card
        className="
          bg-gradient-to-br from-[#DAF7A6] via-indigo-300 to-pink-300
          dark:from-gray-900 dark:via-slate-800 dark:to-gray-700
          text-white shadow-2xl rounded-2xl p-6 w-[90%] md:w-[70%] mx-auto
          backdrop-blur-sm
          text-black dark:text-white
          font-semibold
          hover:shadow-lg transition-shadow duration-300 ease-in-out
          focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-400
          focus-within:outline-none
          hover:scale-[1.01] transform
          hover:bg-gradient-to-br hover:from-[#B0F2B6] hover:via-indigo-400 hover:to-pink-400
          dark:hover:from-gray-800 dark:hover:via-slate-700 dark:hover:to-gray-600
        "
      >
        {/* Header */}
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-300" />
            Premium Sponsor
          </CardTitle>
          <span className="text-sm bg-white/20 dark:bg-white/10 px-3 py-1 rounded-full">
            Admin Access
          </span>
        </CardHeader>

        {/* Description */}
        <CardContent>
          <p className="text-base mt-1 leading-relaxed">
            Full access to campaign metrics, live user activity, and advanced
            management tools to optimize your sponsorship impact.
          </p>

          {/* Stats */}
          <div className="mt-6 flex justify-between text-center">
            <div>
              <p className="text-sm text-white/70">New Signups</p>
              <p className="text-xl font-semibold">350+</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Campaigns</p>
              <p className="text-xl font-semibold">8 Active</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Engagement</p>
              <p className="text-xl font-semibold">87%</p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-3 rounded-xl shadow-inner">
              <Activity className="w-5 h-5 text-green-300" />
              <span className="text-sm">Live User Monitoring</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-3 rounded-xl shadow-inner">
              <TrendingUp className="w-5 h-5 text-orange-300" />
              <span className="text-sm">Performance Reports</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-3 rounded-xl shadow-inner">
              <Settings className="w-5 h-5 text-blue-300" />
              <span className="text-sm">Admin Controls</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-3 rounded-xl shadow-inner">
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="text-sm">Priority Support</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              className="w-full bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold py-2 rounded-lg transition
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
              focus:ring-offset-[#DAF7A6] dark:focus:ring-offset-gray-900"
              aria-label="View Dashboard"
            >
              View Dashboard
            </button>
            <button
              className="w-full bg-white/30 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/30 text-white font-semibold py-2 rounded-lg transition
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
              focus:ring-offset-[#DAF7A6] dark:focus:ring-offset-gray-900"
              aria-label="Go to Admin Settings"
            >
              Admin Settings
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
