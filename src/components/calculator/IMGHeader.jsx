export default function IMGHeader() {
  return (
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
  );
}