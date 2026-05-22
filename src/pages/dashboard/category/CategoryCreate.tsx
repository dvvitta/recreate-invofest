import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCategory } from "../../../Hooks/useCategories"; 

export default function CategoryCreate() {
  const navigate = useNavigate();
  
  // 1. Panggil hook mutasi React Query
  const createCategoryMutation = useCreateCategory();

  const [categoryName, setCategoryName] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSaveClick = () => {
    if (categoryName.trim() === "") {
      setHasError(true);
    } else {
      setHasError(false);
      
      // 2. Kirim payload objek 
      createCategoryMutation.mutate(
        { name: categoryName },
        {
          onSuccess: () => {
            alert(`Category "${categoryName}" berhasil disimpan!`);
            navigate("/dashboard/category"); 
          },
          onError: (error: any) => {
            alert(`Gagal menyimpan: ${error?.response?.data?.message || error.message}`);
          },
        }
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Category</h2>

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
            disabled={createCategoryMutation.isPending} 
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
            disabled={createCategoryMutation.isPending} 
            className="bg-red-900 text-white hover:bg-red-800 font-semibold py-2.5 px-8 rounded-lg transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {createCategoryMutation.isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}