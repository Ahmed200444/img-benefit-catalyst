import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchedulingSection() {
  return (
    <div className="mt-8 rounded-2xl p-7 text-white flex flex-col sm:flex-row items-center gap-6 shadow-lg"
      style={{ background: "linear-gradient(135deg, #0d2137 0%, #1a4a7a 70%, #2b7a9e 100%)" }}>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#7ec8e3" }}>Next Steps</p>
        <h3 className="text-xl font-bold mb-1">Ready to Learn More?</h3>
        <p className="text-sm" style={{ color: "#a8d8ea" }}>
          Schedule a free consultation with an IMG financial advisor to discuss your results and explore the full range of Preventive Pay benefits available to your business.
        </p>
      </div>
      <a
        href="https://calendly.com/integratedmanagementgroupllc/30min"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="font-semibold px-6 py-3 rounded-xl flex items-center gap-2 whitespace-nowrap border-2 border-white text-white hover:text-gray-900 hover:bg-white transition-colors"
          style={{ background: "transparent" }}>
          <CalendarDays className="w-5 h-5" />
          Schedule a Consultation
        </Button>
      </a>
    </div>
  );
}