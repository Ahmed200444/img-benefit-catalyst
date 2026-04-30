import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import IMGHeader from "@/components/calculator/IMGHeader";
import ResultsTable from "@/components/calculator/ResultsTable";
import SchedulingSection from "@/components/calculator/SchedulingSection";
import { CheckCircle2 } from "lucide-react";

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

export default function Calculator() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calcEmployees, setCalcEmployees] = useState(null);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.num_employees) {
      toast.error("Please fill in Name, Email, and Number of Employees to calculate.");
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
    setCalcEmployees(n);
    setSubmitted(true);
    setLoading(false);
    toast.success("Your results are ready!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: "#eaf3f8" }}>
        <IMGHeader />
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
    <div className="min-h-screen" style={{ background: "#eaf3f8" }}>
      <IMGHeader />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-8">
          <h2 className="text-lg font-bold mb-1" style={{ color: "#0d2137" }}>Business Information</h2>
          <p className="text-sm text-gray-500 mb-6">
            Fill in the form below to calculate your estimated Preventive Pay employer savings. Fields marked <span className="text-red-500">*</span> are required.
          </p>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input id="name" placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="jane@company.com" value={form.email} onChange={e => set("email", e.target.value)} required />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="cell_phone">Cell Phone</Label>
                <Input id="cell_phone" placeholder="(305) 000-0000" value={form.cell_phone} onChange={e => set("cell_phone", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" placeholder="Acme Corp" value={form.company_name} onChange={e => set("company_name", e.target.value)} />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="industry">Industry</Label>
                <Select value={form.industry} onValueChange={v => set("industry", v)}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="company_website">Company Website</Label>
                <Input id="company_website" placeholder="https://yourcompany.com" value={form.company_website} onChange={e => set("company_website", e.target.value)} />
              </div>
            </div>

            {/* KEY CALC FIELD */}
            <div className="rounded-xl p-4 space-y-1" style={{ background: "#e8f4fb", border: "1px solid #2b7a9e33" }}>
              <Label htmlFor="num_employees" className="font-semibold" style={{ color: "#0d2137" }}>
                Number of Employees <span className="text-red-500">*</span>
              </Label>
              <Input
                id="num_employees"
                type="number"
                min="1"
                placeholder="e.g. 50"
                value={form.num_employees}
                onChange={e => set("num_employees", e.target.value)}
                className="bg-white"
                required
              />
              <p className="text-xs" style={{ color: "#2b7a9e" }}>This is the key input for your savings calculation.</p>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="avg_employee_salary">Avg Employee Salary ($)</Label>
                <Input id="avg_employee_salary" type="number" placeholder="55000" value={form.avg_employee_salary} onChange={e => set("avg_employee_salary", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Avg Employee Marital Status</Label>
                <Select value={form.avg_marital_status} onValueChange={v => set("avg_marital_status", v)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="gross_revenue_last_year">Gross Revenue Last Year ($)</Label>
                <Input id="gross_revenue_last_year" type="number" placeholder="1000000" value={form.gross_revenue_last_year} onChange={e => set("gross_revenue_last_year", e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Open to Hearing About More Benefits?</Label>
                <Select value={form.openness_to_benefits} onValueChange={v => set("openness_to_benefits", v)}>
                  <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very Open">Very Open</SelectItem>
                    <SelectItem value="Somewhat Open">Somewhat Open</SelectItem>
                    <SelectItem value="Not Sure">Not Sure</SelectItem>
                    <SelectItem value="Not Interested">Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl text-base"
              style={{ background: "linear-gradient(90deg, #0d2137 0%, #1a4a7a 60%, #2b7a9e 100%)" }}
            >
              {loading ? "Calculating..." : "Calculate My Savings →"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}