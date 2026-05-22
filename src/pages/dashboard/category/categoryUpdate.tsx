import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoryById, useUpdateCategory } from "../../../Hooks/useCategories"; // Sesuaikan path hooks kamu

export default function CategoryEdit() {
  const { id } = useParams<{ id: string }>(); // Ambil ID dari URL router
  const categoryId = Number(id); // Paksa string ID ke number (Int Prisma)
  
  const navigate = useNavigate();

  // Ambil data kategori lama dan panggil fungsi mutasi update
  const { data: currentCategory, isLoading, isError } = useGetCategoryById(categoryId);
  const updateCategoryMutation = useUpdateCategory();

  const [categoryName, setCategoryName] = useState("");
  const [hasError, setHasError] = useState(false);

  // Set nilai awal form input ketika data lama berhasil di-fetch dari Railway
  useEffect(() => {
    if (currentCategory) {
      setCategoryName(currentCategory.name);
    }
  }, [currentCategory]);

  const handleSaveClick = () => {
    if (categoryName.trim() === "") {
      setHasError(true);
    } else {
      setHasError(false);

      // Jalankan mutasi update data ke API backend
      updateCategoryMutation.mutate(
        { 
          id: categoryId, 
          updatedData: { name: categoryName } 
        },
        {
          onSuccess: () => {
            alert(`Category berhasil diperbarui menjadi "${categoryName}"!`);
            navigate("/dashboard/category"); // Balik ke halaman utama tabel kategori
          },
          onError: (error: any) => {
            alert(`Gagal memperbarui: ${error?.response?.data?.message || error.message}`);
          },
        }
      );
    }
  };

  if (isLoading) return <div className="text-center mt-10 text-gray-500">Memuat data kategori lama...</div>;
  if (isError) return <div className="text-center mt-10 text-red-600">Gagal memuat data. Kategori tidak ditemukan.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Category</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              if (e.target.value.trim() !== "") setHasError(false);
            }}
            className={`w-full px-4 py-2 border rounded-lg transition-all outline-none ${
              hasError
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-300 focus:ring-2 focus:ring-red-900/20 focus:border-red-900"
            }`}
            placeholder="e.g. Technology"
            disabled={updateCategoryMutation.isPending}
          />
          {hasError && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              Category name is required!
            </p>
          )}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/category")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={updateCategoryMutation.isPending}
            className="bg-red-900 text-white hover:bg-red-800 font-semibold py-2.5 px-8 rounded-lg transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {updateCategoryMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}