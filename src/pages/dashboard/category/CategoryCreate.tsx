import { useState } from "react";

export default function CategoryCreate() {
  const [categoryName, setCategoryName] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSaveClick = () => {
    if (categoryName.trim() === "") {
      setHasError(true);
    } else {
      setHasError(false);
      alert(`Category "${categoryName}" tersimpan!`);
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
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
            placeholder="e.g. Technology"
          />
          {hasError && (
            <p className="text-red-500 text-xs mt-1 font-medium">
              Category name is required!
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveClick}
            className="bg-red-900 text-white hover:bg-red-800 font-semibold py-2.5 px-8 rounded-lg transition-colors shadow-sm active:scale-[0.98]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
