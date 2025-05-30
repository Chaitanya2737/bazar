import { Switch } from "@/components/ui/switch";

export default function PricingToggle({ isYearly, setIsYearly }) {
  return (
    <div className="flex justify-center items-center gap-4 mb-12">
      <span className="text-gray-700 dark:text-gray-200 font-medium">Monthly</span>
      <Switch
        checked={isYearly}
        onCheckedChange={() => setIsYearly(!isYearly)}
        className={`
          relative inline-flex h-8 w-10 shrink-0 cursor-pointer rounded-full border-2 
          border-transparent transition-all duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
          ${isYearly ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}
        `}
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0
            transition duration-200 ease-in-out
          "
          style={{
            transform: isYearly ? "translateX(32px)" : "translateX(0px)",
          }}
        />
      </Switch>
      <span className="text-gray-700 dark:text-gray-200 font-medium">Yearly</span>
    </div>
  );
}