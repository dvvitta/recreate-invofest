import { useState } from "react";
import { z } from "zod";

// Schema Zod untuk Speaker
const speakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required"),
  role: z.string().min(1, "Role is required"),
});

export default function SpeakerCreate() {
  const [formData, setFormData] = useState({ name: "", role: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSave = () => {
    const result = speakerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      console.log("Speaker Data:", result.data);
      alert("Speaker berhasil disimpan!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Add New Speaker</h2>

      <div className="flex flex-col gap-4">
        {/* Speaker Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            type="text"
            onChange={handleInputChange}
            placeholder="Name"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Role
          </label>
          <input
            name="role"
            type="text"
            onChange={handleInputChange}
            placeholder="Role"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.role ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
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
