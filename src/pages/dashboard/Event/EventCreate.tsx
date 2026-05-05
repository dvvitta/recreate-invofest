import { useState } from "react";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function EventCreate() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSave = () => {
    const result = eventSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      console.log("Data Valid:", result.data);
      alert("Event berhasil disimpan!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Create New Event</h2>

      <div className="flex flex-col gap-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Event Name
          </label>
          <input
            name="name"
            type="text"
            onChange={handleInputChange}
            placeholder="Event Name"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <input
            name="category"
            type="text"
            onChange={handleInputChange}
            placeholder="Category"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.category ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date
          </label>
          <input
            name="date"
            type="date"
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.date ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleInputChange}
            placeholder="Add new description"
            className={`w-full px-4 py-2 border rounded-lg outline-none h-24 ${errors.description ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
