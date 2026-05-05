export default function DashboardIndex() {
  const stats = [
    { label: "Total Events", value: "0", color: "text-red-900" },
    { label: "Total Speakers", value: "0", color: "text-blue-900" },
    { label: "Total Categories", value: "0", color: "text-emerald-900" },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Selamat datang kembali, Devita!</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {stat.label}
            </h3>
            <p className={`text-4xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Welcome Section */}
      <div className="mt-8 p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">Overview</h2>
        <p className="text-gray-600 mt-2">
          Pilih menu di samping untuk mulai mengelola data Event, Speakers, dan Categories Anda.
        </p>
      </div>
    </div>
  );
}