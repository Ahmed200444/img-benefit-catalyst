export default function IMGHeader() {
  return (
    <div className="bg-white border-b border-gray-200 py-6 px-8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <img
          src="https://media.base44.com/images/public/69ef51411508c5fd1298be28/c8cc4f57d_IMGlogo.png"
          alt="Integrated Management Group"
          className="h-20 w-auto object-contain"
        />
        <div className="sm:ml-4 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PreventivePay Savings Calculator</h1>
          <p className="text-gray-500 text-sm mt-1">Discover how much your business could save with PreventivePay</p>
        </div>
      </div>
    </div>
  );
}