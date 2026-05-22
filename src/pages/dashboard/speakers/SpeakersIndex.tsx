import { Link } from "react-router-dom";
import { useGetSpeakers, useDeleteSpeaker } from "../../../Hooks/useSpeakers"; // Sesuaikan path relative ke hooks kamu

export default function SpeakerIndex() {
  // 1. Ambil data pembicara & fungsi mutasi hapus dari React Query
  const { data: speakers, isLoading, isError } = useGetSpeakers();
  const deleteSpeakerMutation = useDeleteSpeaker();

  // 2. Handler konfirmasi hapus data
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Apakah kamu yakin ingin menghapus pembicara "${name}"?`)) {
      deleteSpeakerMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Speakers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your event speakers here</p>
        </div>
        <Link
          to="/dashboard/speakers/create"
          className="bg-red-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98]"
        >
          + Add New Speaker
        </Link>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* STATUS LOADING */}
            {isLoading && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-gray-500 text-sm">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-900 border-t-transparent rounded-full animate-spin"></div>
                    Memuat data pembicara...
                  </div>
                </td>
              </tr>
            )}

            {/* STATUS ERROR KONEKSI */}
            {isError && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-red-600 text-sm font-medium">
                  Gagal mengambil data pembicara dari server Railway.
                </td>
              </tr>
            )}

            {/* JIKA DATA BERHASIL DI-FETCH NAMUN KOSONG */}
            {!isLoading && !isError && speakers?.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-gray-400 text-sm italic">
                  No speakers found. Click "Add New Speaker" to create one.
                </td>
              </tr>
            )}

            {/* LOOPING DATA SPEAKER DARI DATABASE */}
            {!isLoading && !isError && speakers?.map((speaker) => (
              <tr key={speaker.id} className="hover:bg-gray-50 transition-colors">
                {/* Kolom Nama + Avatar Gambar */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="flex items-center gap-3">
                    <img
                      src={speaker.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} // Fallback avatar jika kosong
                      alt={speaker.name}
                      className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
                      onError={(e) => {
                        // Jika URL gambar rusak, ganti otomatis ke avatar cadangan
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80";
                      }}
                    />
                    <div>
                      <span className="block font-semibold text-gray-800">{speaker.name}</span>
                      <span className="text-xs text-gray-400">ID Speaker: {speaker.id}</span>
                    </div>
                  </div>
                </td>
                
                {/* Kolom Jabatan / Role */}
                <td className="px-6 py-4 text-gray-600 font-medium">{speaker.role}</td>
                
                {/* Kolom Tombol Aksi */}
                <td className="px-6 py-4 text-right space-x-3">
                  <Link
                    to={`/dashboard/speakers/edit/${speaker.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(speaker.id, speaker.name)}
                    disabled={deleteSpeakerMutation.isPending}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {deleteSpeakerMutation.isPending && deleteSpeakerMutation.variables === speaker.id
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