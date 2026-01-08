import { ArrowRight } from "lucide-react";

export function PromoBanner() {
  const handleClick = () => {
    window.history.pushState({}, "", "/website-launch-intake");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="relative bg-[#E45792] text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-center">
          <p className="text-sm md:text-base">
            <span className="font-semibold">New Year Sale!</span>
            <span className="hidden sm:inline"> Get your website launched for just $349.</span>
          </p>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-1 text-sm md:text-base font-medium underline underline-offset-4 hover:text-blue-200 transition-all whitespace-nowrap cursor-pointer"
          >
            Sign Up Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
