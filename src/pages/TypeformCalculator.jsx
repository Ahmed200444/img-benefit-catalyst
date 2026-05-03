import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ResultsTable from "@/components/calculator/ResultsTable";
import SchedulingSection from "@/components/calculator/SchedulingSection";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const RATE = 658.66;

const INDUSTRIES = [
  "Accounting & Finance", "Construction", "Education", "Food & Beverage",
  "Healthcare", "Hospitality", "Legal", "Manufacturing", "Non-Profit",
  "Real Estate", "Retail", "Technology", "Transportation", "Other"
];

const STEPS = [
  { key: "name", label: "What's your full name?", type: "text", placeholder: "Jane Smith", required: true },
  { key: "email", label: "What's your email address?", type: "email", placeholder: "jane@company.com", required: true },
  { key: "cell_phone", label: "What's your cell phone number?", type: "tel", placeholder: "(305) 000-0000", required: false, formatPhone: true },
  { key: "company_name", label: "What's your company name?", type: "text", placeholder: "Acme Corp", required: false },
  { key: "industry", label: "What industry are you in?", type: "select", options: INDUSTRIES, required: false },
  { key: "company_website", label: "What's your company website?", type: "text", placeholder: "https://yourcompany.com", required: false },
  { key: "num_employees", label: "How many employees does your company have?", type: "number", placeholder: "e.g. 50", required: true, hint: "This is the key input for your savings estimate." },
  { key: "avg_employee_salary", label: "What's the average employee salary?", type: "number", placeholder: "e.g. 55000", required: false, prefix: "$" },
  { key: "avg_marital_status", label: "What's the average marital status of your employees?", type: "select", options: ["Married", "Single", "Mixed"], required: false },
  { key: "gross_revenue_last_year", label: "What was your gross revenue last year?", type: "number", placeholder: "e.g. 1000000", required: false, prefix: "$" },
  { key: "openness_to_benefits", label: "How many employees are currently on coverage?", type: "select", options: ["Very Open", "Somewhat Open", "Not Sure", "Not Interested"], required: false },
];

export default function TypeformCalculator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const current = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleNext = async () => {
    if (current.required && !inputVal && form[current.key] === undefined) {
      toast.error("This field is required.");
      return;
    }
    const val = current.type === "number" ? parseFloat(inputVal) || inputVal : inputVal;
    const newForm = { ...form, [current.key]: val || form[current.key] };
    setForm(newForm);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      setInputVal(newForm[STEPS[step + 1]?.key] || "");
    } else {
      // Submit
      setLoading(true);
      const n = parseFloat(newForm.num_employees);
      const payload = {
        name: newForm.name,
        email: newForm.email,
        cell_phone: newForm.cell_phone,
        company_name: newForm.company_name,
        company_website: newForm.company_website,
        industry: newForm.industry,
        num_employees: n,
        avg_employee_salary: newForm.avg_employee_salary ? parseFloat(newForm.avg_employee_salary) : null,
        avg_marital_status: newForm.avg_marital_status,
        gross_revenue_last_year: newForm.gross_revenue_last_year ? parseFloat(newForm.gross_revenue_last_year) : null,
        openness_to_benefits: newForm.openness_to_benefits,
        calculated_60: Math.round(n * 0.6) * RATE,
        calculated_70: Math.round(n * 0.7) * RATE,
        calculated_80: Math.round(n * 0.8) * RATE,
        calculated_90: Math.round(n * 0.9) * RATE,
      };
      await base44.entities.LeadSubmission.create(payload);
      base44.functions.invoke('syncLeadToSheets', { data: payload });
      setSubmitted(true);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleNext();
  };

  const handleSelectChange = (val) => {
    setInputVal(val);
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "#eaf3f8" }}>
        <div style={{ background: "linear-gradient(135deg, #0d2137 0%, #1a4a7a 60%, #2b7a9e 100%)" }} className="py-8 px-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-5">
            <img
              src="https://media.base44.com/images/public/69ef51411508c5fd1298be28/c8cc4f57d_IMGlogo.png"
              alt="Integrated Management Group"
              className="h-20 w-auto object-contain brightness-0 invert"
            />
            <div className="sm:ml-4 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#7ec8e3" }}>
                Preventive Pay Supplemental Wellness Plan
              </p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Preventive Pay Savings Calculator</h1>
              <p className="text-blue-200 text-sm mt-1">Discover how much your business could save with Preventive Pay</p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Calculation Complete!</p>
              <p className="text-sm text-green-700">Thank you, <strong>{form.name}</strong>. Here are your personalized savings estimates.</p>
            </div>
          </div>
          <ResultsTable employees={parseFloat(form.num_employees)} />
          <SchedulingSection />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1a73e8" }}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-blue-900/30">
        <div
          className="h-1 bg-white/60 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Logo top-left */}
      <div className="px-8 pt-6">
        <img
          src="https://media.base44.com/images/public/69ef51411508c5fd1298be28/c8cc4f57d_IMGlogo.png"
          alt="IMG"
          className="h-10 w-auto object-contain brightness-0 invert opacity-80"
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          {/* Step counter */}
          <p className="text-white/60 text-sm font-medium mb-3 uppercase tracking-widest">
            {step + 1} / {STEPS.length}
          </p>

          {/* Label */}
          <h2 className="text-white text-3xl sm:text-4xl font-light mb-2 leading-snug">
            {current.label}
          </h2>
          {current.hint && (
            <p className="text-white/70 text-sm mb-6">{current.hint}</p>
          )}
          {!current.hint && <div className="mb-8" />}

          {/* Input */}
          <div className="w-full">
            {current.type === "select" ? (
              <div className="space-y-3">
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setInputVal(opt); }}
                    className={`w-full text-left px-5 py-3 rounded-xl border-2 text-white font-medium transition-all text-base
                      ${inputVal === opt
                        ? "border-white bg-white/20"
                        : "border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/60"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                {current.prefix && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-lg font-semibold">{current.prefix}</span>
                )}
                <input
                  autoFocus
                  type={current.type}
                  placeholder={current.placeholder}
                  value={inputVal}
                  onChange={e => setInputVal(current.formatPhone ? formatPhone(e.target.value) : e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full bg-transparent border-b-2 border-white/50 focus:border-white outline-none text-white text-2xl placeholder-white/40 py-3 transition-all
                    ${current.prefix ? "pl-8" : "pl-0"}`}
                />
              </div>
            )}
          </div>

          {/* Next button */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center gap-2 bg-white text-blue-700 font-bold px-7 py-3 rounded-xl hover:bg-blue-50 transition-all text-base shadow-lg disabled:opacity-50"
            >
              {loading ? "Submitting..." : step === STEPS.length - 1 ? "See My Results" : "OK"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
            {!current.required && (
              <button
                onClick={() => { setInputVal(""); handleNext(); }}
                className="text-white/60 text-sm hover:text-white/90 transition-all"
              >
                Skip →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-1.5 pb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-white w-5" : i < step ? "bg-white/60" : "bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}