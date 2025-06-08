import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Crown, TrendingUp, Settings, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSponsorCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="px-4 py-6"
    >
      <Card
        className="
          bg-gradient-to-br from-[#DAF7A6] via-indigo-300 to-pink-300
          dark:from-gray-900 dark:via-slate-800 dark:to-gray-700
          text-black dark:text-white
          shadow-2xl rounded-2xl p-5 sm:p-6
          max-w-xl w-full mx-auto
          backdrop-blur-sm
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
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 flex-shrink-0" />
            Premium Sponsor
          </CardTitle>
          <span className="text-xs sm:text-sm bg-white/20 dark:bg-white/10 px-2.5 py-1 rounded-full self-start sm:self-auto whitespace-nowrap">
            Admin Access
          </span>
        </CardHeader>

        {/* Description */}
        <CardContent>
          <p className="text-sm sm:text-base mt-2 leading-relaxed">
            Full access to campaign metrics, live user activity, and advanced
            management tools to optimize your sponsorship impact.
          </p>

          {/* Stats */}
          <div className="mt-5 flex flex-col sm:flex-row justify-between text-center gap-4 sm:gap-0">
            {[
              { label: "New Signups", value: "350+" },
              { label: "Campaigns", value: "8 Active" },
              { label: "Engagement", value: "87%" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs sm:text-sm text-white/70">{label}</p>
                <p className="text-lg sm:text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-2.5 sm:p-3 rounded-xl shadow-inner">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" />
              <span>Live User Monitoring</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-2.5 sm:p-3 rounded-xl shadow-inner">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300 flex-shrink-0" />
              <span>Performance Reports</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-2.5 sm:p-3 rounded-xl shadow-inner">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300 flex-shrink-0" />
              <span>Admin Controls</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 p-2.5 sm:p-3 rounded-xl shadow-inner">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 flex-shrink-0" />
              <span>Priority Support</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              className="w-full bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold py-2 rounded-lg text-sm sm:text-base transition
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400
              focus:ring-offset-[#DAF7A6] dark:focus:ring-offset-gray-900"
              aria-label="View Dashboard"
            >
              View Dashboard
            </button>
            <button
              className="w-full bg-white/30 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/30 text-white font-semibold py-2 rounded-lg text-sm sm:text-base transition
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
