const RATE = 658.66;

function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function ResultsTable({ employees }) {
  if (!employees || employees <= 0) return null;

  const recommended = Math.round(employees * 0.8);
  const recommendedAnnual = recommended * RATE;
  const recommendedMonthly = recommendedAnnual / 12;

  const scenarios = [
    { pct: 0.6, label: "60% Participation" },
    { pct: 0.7, label: "70% Participation" },
    { pct: 0.8, label: "80% Participation", highlight: true },
    { pct: 0.9, label: "90% Participation" },
  ];

  return (
    <div className="mt-6">
      {/* Hero savings banner */}
      <div className="rounded-2xl overflow-hidden mb-6 shadow-lg" style={{ background: "linear-gradient(135deg, #0d2137 0%, #1a4a7a 60%, #2b7a9e 100%)" }}>
        <div className="px-8 py-10 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#7ec8e3", letterSpacing: "0.2em" }}>
            PREVENTIVE PAY SUPPLEMENTAL WELLNESS PLAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-1">Your Estimated Annual Savings</h2>
          <p className="text-sm mb-8" style={{ color: "#a8d8ea" }}>
            Based on <strong className="text-white">{employees}</strong> employees · {fmt(RATE)} savings per enrolled employee
          </p>

          {/* Big number */}
          <div className="inline-block rounded-2xl px-10 py-6 mb-8 border border-white/20" style={{ background: "rgba(255,255,255,0.1)" }}>
            <p className="text-sm mb-1" style={{ color: "#7ec8e3" }}>Recommended Savings (80% participation)</p>
            <p className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight">{fmt(recommendedAnnual)}</p>
            <p className="text-sm mt-2" style={{ color: "#a8d8ea" }}>{fmt(recommendedMonthly)} per month</p>
          </div>

          {/* 3 stats */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { value: recommended, label: "Enrolled Employees" },
              { value: fmt(RATE), label: "Savings Per Employee" },
              { value: "0%", label: "Cost to Employer" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-3 border border-white/20" style={{ background: "rgba(255,255,255,0.08)" }}>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs mt-1" style={{ color: "#a8d8ea" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scenario breakdown */}
      <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "#1a4a7a" }}>
        All Participation Scenarios
      </h3>
      <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ borderColor: "#c5dff0" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#0d2137" }} className="text-white">
              <th className="px-5 py-3 text-left font-semibold">Participation</th>
              <th className="px-5 py-3 text-right font-semibold">Enrolled</th>
              <th className="px-5 py-3 text-right font-semibold">Annual Savings</th>
              <th className="px-5 py-3 text-right font-semibold">Monthly Savings</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map(({ pct, label, highlight }) => {
              const enrolled = Math.round(employees * pct);
              const annual = enrolled * RATE;
              const monthly = annual / 12;
              return (
                <tr key={pct} style={highlight ? { background: "#e0f0f8" } : { background: pct === 0.7 ? "#f5fafd" : "white" }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "#0d2137" }}>
                    {label}
                    {highlight && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: "#2b7a9e" }}>
                        Recommended
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-600">{enrolled}</td>
                  <td className="px-5 py-3 text-right font-bold" style={{ color: "#0d5c2e" }}>{fmt(annual)}</td>
                  <td className="px-5 py-3 text-right" style={{ color: "#1a7a40" }}>{fmt(monthly)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        * This estimate is for illustrative purposes only and is not intended as final underwriting or payroll-tax advice.
      </p>
    </div>
  );
}