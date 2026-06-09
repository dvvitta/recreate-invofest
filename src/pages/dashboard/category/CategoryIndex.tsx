import { Link } from "react-router-dom";
import {
  useGetCategories,
  useDeleteCategory,
} from "../../../Hooks/useCategories";

export default function CategoryIndex() {
  const { data: categories, isLoading, isError } = useGetCategories();
  const deleteCategoryMutation = useDeleteCategory();

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(`Apakah kamu yakin ingin menghapus kategori "${name}"?`)
    ) {
      deleteCategoryMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Category Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Organize your events into categories
          </p>
        </div>
        <Link
          to="/dashboard/category/create"
          className="bg-red-900 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98]"
        >
          + Add New Category
        </Link>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td
                  colSpan={2}
                  className="py-12 text-center text-gray-500 text-sm"
                >
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-900 border-t-transparent rounded-full animate-spin"></div>
                    Memuat data kategori...
                  </div>
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td
                  colSpan={2}
                  className="py-12 text-center text-red-600 text-sm font-medium"
                >
                  Gagal mengambil data kategori dari server.
                </td>
              </tr>
            )}

            {!isLoading && !isError && categories?.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="py-12 text-center text-gray-400 text-sm italic"
                >
                  No categories found. Click "Add New Category" to start.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              categories?.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {category.name}
                    <span className="text-xs text-gray-400 ml-2 font-normal">
                      (ID: {category.id})
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <Link
                      to={`/dashboard/category/edit/${category.id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      disabled={deleteCategoryMutation.isPending}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {deleteCategoryMutation.isPending &&
                      deleteCategoryMutation.variables === category.id
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
