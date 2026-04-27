const RATE = 658.66;

function fmt(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}

export default function ResultsTable({ employees }) {
  if (!employees || employees <= 0) return null;

  const scenarios = [
    { pct: 0.6, label: "60% Participation" },
    { pct: 0.7, label: "70% Participation" },
    { pct: 0.8, label: "80% Participation", highlight: true },
    { pct: 0.9, label: "90% Participation" },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Your Estimated Employer Savings</h2>
      <p className="text-sm text-gray-500 mb-4">Based on <strong>{employees}</strong> total employees at <strong>{fmt(RATE)}</strong> savings per enrolled employee annually.</p>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="px-5 py-3 text-left font-semibold">Participation Level</th>
              <th className="px-5 py-3 text-right font-semibold">Enrolled Employees</th>
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
                  className={highlight ? "bg-yellow-50 font-semibold" : "bg-white even:bg-gray-50"}
                >
                  <td className="px-5 py-3 text-gray-800">
                    {label}
                    {highlight && <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Recommended</span>}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-700">{enrolled}</td>
                  <td className="px-5 py-3 text-right text-green-700">{fmt(annual)}</td>
                  <td className="px-5 py-3 text-right text-green-600">{fmt(monthly)}</td>
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