import { useGetEvents } from "../../Hooks/useEvent";
import { useGetSpeakers } from "../../Hooks/useSpeakers";
import { useGetCategories } from "../../Hooks/useCategories";
import { useGetUsers } from "../../Hooks/useAuth";

export default function DashboardIndex() {
  const { data: events, isLoading: loadingEvents } = useGetEvents();
  const { data: speakers, isLoading: loadingSpeakers } = useGetSpeakers();
  const { data: categories, isLoading: loadingCategories } = useGetCategories();
  const { data: users, isLoading: loadingUsers } = useGetUsers(); 

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
    {
      label: "Total Users",
      value: loadingUsers ? "..." : String(users?.length || 0),
      color: "text-amber-900", 
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 lg:p-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Selamat datang kembali, Devita!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm transition-transform hover:scale-[1.01]"
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
    </div>
  );
}