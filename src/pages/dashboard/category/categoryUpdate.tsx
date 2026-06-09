import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoryById, useUpdateCategory } from "../../../Hooks/useCategories"; 
import toast from "react-hot-toast"; 

export default function CategoryEdit() {
  const { id } = useParams<{ id: string }>(); 
  const categoryId = Number(id); 
  const navigate = useNavigate();

  const { data: currentCategory, isLoading, isError } = useGetCategoryById(categoryId);
  const updateCategoryMutation = useUpdateCategory();

  const [categoryName, setCategoryName] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      setCategoryName(currentCategory.name);
    }
  }, [currentCategory]);

  const handleSaveClick = () => {
    if (categoryName.trim() === "") {
      setHasError(true);
      toast.error("Nama kategori wajib diisi!", { id: "validation-category-edit-error" });
    } else {
      setHasError(false);

      const updateCategoryPromise = new Promise((resolve, reject) => {
        updateCategoryMutation.mutate(
          { 
            id: categoryId, 
            updatedData: { name: categoryName } 
          },
          {
            onSuccess: () => {
              resolve(`Category berhasil diperbarui menjadi "${categoryName}"!`);
              setTimeout(() => {
                navigate("/dashboard/category"); 
              }, 1000);
            },
            onError: (error: any) => {
              const errorMessage = error.response?.data?.message || error.message || "Gagal memperbarui kategori.";
              reject(errorMessage);
            },
          }
        );
      });

      toast.promise(updateCategoryPromise, {
        loading: "Sedang menyimpan perubahan kategori...",
        success: (msg: any) => `${msg}`,
        error: (err: any) => `${err}`,
      }, {
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
          fontSize: "14px",
        },
        success: {
          duration: 2000,
          iconTheme: {
            primary: "#7f1d1d", 
            secondary: "#fff",
          },
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 gap-2">
        <div className="w-5 h-5 border-2 border-red-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Memuat data kategori lama...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
        <p className="text-red-600 font-medium mb-4">Gagal memuat data. Kategori tidak ditemukan.</p>
        <button 
          onClick={() => navigate("/dashboard/category")}
          className="text-sm font-semibold text-gray-600 hover:underline"
        >
          Kembali ke Manajemen Kategori
        </button>
      </div>
    );
  }

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
            } ${updateCategoryMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
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
            disabled={updateCategoryMutation.isPending} 
            onClick={() => navigate("/dashboard/category")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
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