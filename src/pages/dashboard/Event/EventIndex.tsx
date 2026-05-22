import { Link } from "react-router-dom";
import { useGetEvents, useDeleteEvent } from "../../../Hooks/useEvent"; // Sesuai path hooks kamu

export default function EventIndex() {
  // 1. Ambil data event & status dari React Query
  const { data: events, isLoading, isError } = useGetEvents();
  const deleteEventMutation = useDeleteEvent();

  // 2. Handler untuk menghapus event
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Apakah kamu yakin ingin menghapus event "${name}"?`)) {
      deleteEventMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Events Management</h1>
          <p className="text-gray-500 text-sm mt-1">Keep track of all your upcoming events</p>
        </div>
        <Link
          to="/dashboard/event/create"
          className="bg-red-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98]"
        >
          + Add New Event
        </Link>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">Event Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* STATUS LOADING */}
            {isLoading && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-900 border-t-transparent rounded-full animate-spin"></div>
                    Memuat data dari server Railway...
                  </div>
                </td>
              </tr>
            )}

            {/* STATUS ERROR KONEKSI */}
            {isError && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-red-600 text-sm font-medium">
                  Gagal mengambil data. Pastikan backend Railway sudah aktif dan CORS diizinkan.
                </td>
              </tr>
            )}

            {/* JIKA DATA BERHASIL DI-FETCH & KOSONG */}
            {!isLoading && !isError && events?.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-sm italic">
                  No events found. Click "Add New Event" to get started.
                </td>
              </tr>
            )}

            {/* LOOPING DATA EVENT DARI API */}
            {!isLoading && !isError && events?.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{event.name}</td>
                
                {/* UBAH DI SINI: 
                  Langsung menampilkan nama kategori yang diisi dari dropdown.
                  Kita beri pengaman opsional chaining (?) dan fallback teks 'Uncategorized' 
                  jika ternyata ada data lama yang relasi kategorinya terputus.
                */}
                <td className="px-6 py-4 text-gray-600 font-medium">
                  <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                    {event.category?.name || "Uncategorized"}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-gray-600">
                  {new Date(event.dateEvent).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                
                <td className="px-6 py-4 text-gray-600">{event.location || "-"}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    to={`/dashboard/event/edit/${event.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id, event.name)} 
                    className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors disabled:opacity-50"
                    disabled={deleteEventMutation.isPending}
                  >
                    {deleteEventMutation.isPending && deleteEventMutation.variables === event.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}