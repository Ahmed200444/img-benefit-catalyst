import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchedulingSection() {
  return (
    <div className="mt-8 bg-gray-900 rounded-2xl p-7 text-white flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-1">Ready to Learn More?</h3>
        <p className="text-gray-300 text-sm">
          Schedule a free consultation with an IMG financial advisor to discuss your results and explore the full range of benefits available to your business.
        </p>
      </div>
      <a
        href="https://calendly.com/integratedmgtgroup"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap">
          <CalendarDays className="w-5 h-5" />
          Schedule a Consultation
        </Button>
      </a>
    </div>
  );
}