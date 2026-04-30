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
      {/* Hero savings card */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg, #1a2744 0%, #2d4a8a 100%)" }}>
        <div className="px-8 py-10 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#7eb3ff" }}>
            PREVENTIVEPAY SUPPLEMENTAL WELLNESS PLAN
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-1">Your Estimated Annual Savings</h2>
          <p className="text-blue-200 text-sm mb-8">Based on {employees} employees at {fmt(RATE)} savings per enrolled employee</p>

          {/* Big number highlight */}
          <div className="inline-block bg-white/10 rounded-2xl px-10 py-6 mb-8 border border-white/20">
            <p className="text-blue-200 text-sm mb-1">Recommended (80% participation)</p>
            <p className="text-5xl sm:text-6xl font-extrabold text-white">{fmt(recommendedAnnual)}</p>
            <p className="text-blue-200 text-sm mt-2">{fmt(recommendedMonthly)} / month</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">{recommended}</p>
              <p className="text-blue-200 text-xs mt-1">Enrolled Employees</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">{fmt(RATE)}</p>
              <p className="text-blue-200 text-xs mt-1">Savings Per Employee</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/20">
              <p className="text-2xl font-bold text-white">0%</p>
              <p className="text-blue-200 text-xs mt-1">Cost to Employer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Participation scenarios table */}
      <h3 className="text-base font-bold text-gray-700 mb-3 uppercase tracking-wide">All Participation Scenarios</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#1a2744" }} className="text-white">
              <th className="px-5 py-3 text-left font-semibold">Participation Level</th>
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
                <tr
                  key={pct}
                  className={highlight ? "font-semibold" : "bg-white"}
                  style={highlight ? { background: "#eef4ff" } : {}}
                >
                  <td className="px-5 py-3 text-gray-800">
                    {label}
                    {highlight && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#2d4a8a", color: "white" }}>
                        Recommended
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-600">{enrolled}</td>
                  <td className="px-5 py-3 text-right font-semibold" style={{ color: "#1a6b3c" }}>{fmt(annual)}</td>
                  <td className="px-5 py-3 text-right" style={{ color: "#2a7a4a" }}>{fmt(monthly)}</td>
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