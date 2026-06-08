import { Link } from "react-router-dom";
import { Mail, Trash2, Edit, UserPlus } from "lucide-react";
import { useGetUsers, useDeleteUser } from "../../../Hooks/useAuth"; // Sesuaikan path foldermu

export default function UserIndex() {
  // 1. Ambil data users & status loading/error secara real-time dari database via React Query
  const { data: users, isLoading, isError } = useGetUsers();
  const deleteUserMutation = useDeleteUser();

  // 2. Handler untuk menghapus user langsung ke database
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      deleteUserMutation.mutate(id, {
        onSuccess: () => {
          alert(`User "${name}" has been deleted successfully from database.`);
        },
        onError: (error: any) => {
          alert(`Failed to delete user: ${error?.response?.data?.message || error.message}`);
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered participants and users</p>
        </div>
        <Link
          to="/dashboard/users/create"
          className="inline-flex items-center gap-2 bg-red-900 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          Add New User
        </Link>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">User Name</th>
              <th className="px-6 py-4">Email Address</th>
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
                    Memuat data dari database...
                  </div>
                </td>
              </tr>
            )}

            {/* STATUS ERROR KONEKSI */}
            {isError && !isLoading && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-red-600 text-sm font-medium">
                  Gagal mengambil data. Pastikan backend sudah aktif dan koneksi DB lancar.
                </td>
              </tr>
            )}

            {/* JIKA DATA KOSONG */}
            {!isLoading && !isError && users?.length === 0 && (
              <tr>
                <td colSpan={3} className="py-12 text-center text-gray-400 text-sm italic">
                  No users found. Click "Add New User" to get started.
                </td>
              </tr>
            )}

            {/* LOOPING DATA USER DARI DATABASE */}
            {!isLoading && !isError && users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                {/* Kolom Nama */}
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {user.name}
                </td>
                
                {/* Kolom Email */}
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </td>

                {/* Kolom Aksi */}
                <td className="px-6 py-4 text-right space-x-4">
                  {/* Tombol Edit */}
                  <Link
                    to={`/dashboard/users/edit/${user.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  
                  {/* Tombol Delete dengan Loading State Mutator */}
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    disabled={deleteUserMutation.isPending}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deleteUserMutation.isPending && deleteUserMutation.variables === user.id
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