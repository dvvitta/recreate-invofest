import { useGetEvents } from "../../Hooks/useEvent";
import { useGetSpeakers } from "../../Hooks/useSpeakers";
import { useGetCategories } from "../../Hooks/useCategories";

export default function DashboardIndex() {
  // 1. Ambil data real-time dari masing-masing hook
  const { data: events, isLoading: loadingEvents } = useGetEvents();
  const { data: speakers, isLoading: loadingSpeakers } = useGetSpeakers();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();

  // 2. Petakan jumlah data (.length) secara dinamis ke dalam array stats
  const stats = [
    {
      label: "Total Events",
      value: loadingEvents ? "..." : String(events?.length || 0),
      color: "text-red-900",
    },
    {
      label: "Total Speakers",
      value: loadingSpeakers ? "..." : String(speakers?.length || 0),
      color: "text-blue-900",
    },
    {
      label: "Total Categories",
      value: loadingCategories ? "..." : String(categories?.length || 0),
      color: "text-emerald-900",
    },
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
          <div
            key={index}
            className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm"
          >
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
      {/* Biodata Mahasiswa Section */}
      <div className="mt-8 p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
          Biodata Mahasiswa
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 max-w-2xl text-sm">
          <div className="flex border-b border-gray-50 pb-2">
            <span className="w-28 font-semibold text-gray-500">Nama</span>
            <span className="text-gray-800">: Devita Anggareni</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2">
            <span className="w-28 font-semibold text-gray-500">Semester</span>
            <span className="text-gray-800">: 4 (Empat)</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2">
            <span className="w-28 font-semibold text-gray-500">NIM</span>
            <span className="text-gray-800">: 24090026</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2">
            <span className="w-28 font-semibold text-gray-500">Prodi</span>
            <span className="text-gray-800">: D4 Teknik Informatika</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2">
            <span className="w-28 font-semibold text-gray-500">Kelas</span>
            <span className="text-gray-800">: 4B</span>
          </div>

          <div className="flex border-b border-gray-50 pb-2">
            <span className="w-28 font-semibold text-gray-500">Kampus</span>
            <span className="text-gray-800">: Universitas Harkat Negeri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
