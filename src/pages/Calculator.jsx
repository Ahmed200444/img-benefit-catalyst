import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ResultsTable from "@/components/calculator/ResultsTable";
import SchedulingSection from "@/components/calculator/SchedulingSection";
import { Shield, Zap, Award, Lock, CheckCircle2 } from "lucide-react";

const RATE = 658.66;

const INDUSTRIES = [
  "Accounting & Finance", "Construction", "Education", "Food & Beverage",
  "Healthcare", "Hospitality", "Legal", "Manufacturing", "Non-Profit",
  "Real Estate", "Retail", "Technology", "Transportation", "Other"
];

const initialForm = {
  name: "", email: "", cell_phone: "", company_name: "", industry: "",
  company_website: "", num_employees: "", avg_employee_salary: "",
  avg_marital_status: "", gross_revenue_last_year: "", openness_to_benefits: ""
};

function FieldLabel({ number, label }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
        style={{ background: "#1a4a7a", color: "white" }}>
        {number}
      </span>
      <span className="text-sm font-semibold text-gray-700">
        {label}<span className="text-red-500 ml-0.5">*</span>
      </span>
    </div>
  );
}

export default function Calculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calcEmployees, setCalcEmployees] = useState(null);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.cell_phone || !form.company_name || !form.industry ||
        !form.company_website || !form.num_employees || !form.avg_employee_salary ||
        !form.avg_marital_status || !form.gross_revenue_last_year || !form.openness_to_benefits) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const n = parseFloat(form.num_employees);
    if (isNaN(n) || n <= 0) {
      toast.error("Please enter a valid number of employees.");
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      num_employees: n,
      avg_employee_salary: form.avg_employee_salary ? parseFloat(form.avg_employee_salary) : undefined,
      gross_revenue_last_year: form.gross_revenue_last_year ? parseFloat(form.gross_revenue_last_year) : undefined,
      calculated_60: Math.round(n * 0.6) * RATE,
      calculated_70: Math.round(n * 0.7) * RATE,
      calculated_80: Math.round(n * 0.8) * RATE,
      calculated_90: Math.round(n * 0.9) * RATE,
    };

    await base44.entities.LeadSubmission.create(payload);
    base44.functions.invoke('syncLeadToSheets', { data: payload });
    setCalcEmployees(n);
    setSubmitted(true);
    setLoading(false);
    toast.success("Your results are ready!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "#eaf3f8" }}>
        <div style={{ background: "linear-gradient(160deg, #0d2137 0%, #1a4a7a 60%, #2b5f8a 100%)" }} className="py-10 px-6 text-center">
          <img
            src="https://media.base44.com/images/public/69ef51411508c5fd1298be28/c8cc4f57d_IMGlogo.png"
            alt="Integrated Management Group"
            className="h-20 w-auto object-contain brightness-0 invert mx-auto mb-5"
          />
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#7ec8e3", letterSpacing: "0.18em" }}>
            Preventive Pay Supplemental Wellness Plan
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">Your Savings</h1>
          <p className="text-lg italic font-semibold mt-1" style={{ color: "#7ec8e3" }}>Results are ready</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Calculation Complete!</p>
              <p className="text-sm text-green-700">Thank you, <strong>{form.name}</strong>. Here are your personalized savings estimates.</p>
            </div>
          </div>
          <ResultsTable employees={calcEmployees} />
          <SchedulingSection />
          <div className="mt-8 text-center">
            <button
              onClick={() => { setSubmitted(false); setForm(initialForm); setCalcEmployees(null); }}
              className="text-sm text-gray-500 underline hover:text-gray-700"
            >
              Start a new calculation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#edf2f7" }}>
      {/* Hero Section */}
      <div style={{ background: "linear-gradient(160deg, #0d2137 0%, #1a4a7a 60%, #2b5f8a 100%)" }} className="pb-16 pt-12 px-6 text-center">
        <img
          src="https://media.base44.com/images/public/69ef51411508c5fd1298be28/c8cc4f57d_IMGlogo.png"
          alt="Integrated Management Group"
          className="h-24 w-auto object-contain brightness-0 invert mx-auto mb-6"
        />
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#7ec8e3", letterSpacing: "0.18em" }}>
          Preventive Pay Supplemental Wellness Plan
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Discover Your Potential
        </h1>
        <p className="text-3xl sm:text-4xl font-bold italic mt-1" style={{ color: "#7ec8e3" }}>
          Annual Savings
        </p>
        <p className="text-blue-200 text-base mt-4">Answer a few questions and get your estimate in seconds.</p>

        {/* Trust badges */}
        <div className="mt-8 grid grid-cols-3 max-w-xl mx-auto">
          {[
            { icon: Shield, label: "Secure & Private" },
            { icon: Zap, label: "Instant Results" },
            { icon: Award, label: "No Obligation" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 py-4 border-r border-white/10 last:border-r-0" style={{ background: "rgba(255,255,255,0.06)" }}>
              <Icon className="w-5 h-5" style={{ color: "#7ec8e3" }} />
              <span className="text-white text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-3xl mx-auto px-4 -mt-1 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Company Information</h2>
          <p className="text-gray-500 text-sm mb-8">Fill out the details below to get your estimate.</p>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel number={1} label="Your Name" />
                <Input placeholder="John Doe" value={form.name} onChange={e => set("name", e.target.value)} required className="h-11" />
              </div>
              <div>
                <FieldLabel number={2} label="Your Cell Phone Number" />
                <Input placeholder="(305) 000-0000" value={form.cell_phone} onChange={e => set("cell_phone", formatPhone(e.target.value))} required className="h-11" />
              </div>
            </div>

            <div>
              <FieldLabel number={3} label="Your Email Address" />
              <Input type="email" placeholder="john@company.com" value={form.email} onChange={e => set("email", e.target.value)} required className="h-11" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel number={4} label="Company Name" />
                <Input placeholder="Acme Corp" value={form.company_name} onChange={e => set("company_name", e.target.value)} required className="h-11" />
              </div>
              <div>
                <FieldLabel number={5} label="Company Website" />
                <Input placeholder="company.com" value={form.company_website} onChange={e => set("company_website", e.target.value)} required className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel number={6} label="Gross Revenue Last Year" />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <Input type="number" placeholder="1,000,000" value={form.gross_revenue_last_year} onChange={e => set("gross_revenue_last_year", e.target.value)} required className="h-11 pl-7" />
                </div>
              </div>
              <div>
                <FieldLabel number={7} label="Number of Full Time Employees" />
                <Input type="number" min="1" placeholder="50" value={form.num_employees} onChange={e => set("num_employees", e.target.value)} required className="h-11" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel number={8} label="Average Annual Gross Wages Per Employee" />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <Input type="number" placeholder="55,000" value={form.avg_employee_salary} onChange={e => set("avg_employee_salary", e.target.value)} required className="h-11 pl-7" />
                </div>
              </div>
              <div>
                <FieldLabel number={9} label="Average Employee's Marital Status" />
                <Select value={form.avg_marital_status} onValueChange={v => set("avg_marital_status", v)}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select marital status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <FieldLabel number={10} label="Industry" />
                <Select value={form.industry} onValueChange={v => set("industry", v)}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FieldLabel number={11} label="How many employees are currently on coverage?" />
                <Select value={form.openness_to_benefits} onValueChange={v => set("openness_to_benefits", v)}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select option" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very Open">Very Open</SelectItem>
                    <SelectItem value="Somewhat Open">Somewhat Open</SelectItem>
                    <SelectItem value="Not Sure">Not Sure</SelectItem>
                    <SelectItem value="Not Interested">Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl text-base transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "linear-gradient(90deg, #0d2137 0%, #1a4a7a 60%, #2b7a9e 100%)" }}
            >
              {loading ? "Calculating..." : "Calculate Your Savings →"}
            </button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" />
              Your information is kept confidential and will not be shared with third parties.
            </p>
          </form>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center rounded-2xl p-8 shadow-sm" style={{ background: "white" }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#1a4a7a" }}>Ready for a deeper dive into your benefits?</p>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Register for Our Webinar</h3>
          <p className="text-gray-500 text-sm mb-6">Turn supplemental benefits into a powerful tax strategy—join our 30-minute overview</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.eventbrite.com/e/supplemental-benefits-1000-per-employee-at-no-additional-cost-tickets-1988191175326?aff=oddtdtcreator"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #0d2137, #1a4a7a)" }}
            >
              Register for Webinar
            </a>
            <a
              href="tel:+13057867488"
              className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-xl text-sm border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: "#1a4a7a", color: "#1a4a7a" }}
            >
              Call 305.786.7488
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            <a href="https://integratedmgtgroup.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">integratedmgtgroup.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}