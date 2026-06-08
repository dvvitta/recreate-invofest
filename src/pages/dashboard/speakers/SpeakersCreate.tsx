import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateSpeaker } from "../../../Hooks/useSpeakers"; // Sesuaikan path relative ke hooks kamu

// Schema Zod diperbarui dengan menambahkan field image
const speakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().url("Must be a valid image URL").min(1, "Speaker image URL is required"),
});

export default function SpeakerCreate() {
  const navigate = useNavigate();
  const createSpeakerMutation = useCreateSpeaker();

  const [formData, setFormData] = useState({ 
    name: "", 
    role: "",
    image: "" 
  });
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

      // Eksekusi kirim data ke API Railway via React Query mutator
      createSpeakerMutation.mutate(result.data, {
        onSuccess: () => {
          alert(`Speaker "${formData.name}" berhasil disimpan!`);
          navigate("/dashboard/speakers"); // Otomatis balik ke halaman list pembicara
        },
        onError: (error: any) => {
          alert(`Gagal menyimpan: ${error?.response?.data?.message || error.message}`);
        }
      });
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
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.name ? "border-red-500" : "border-gray-300 focus:border-red-900"}`}
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
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g. Senior Web Developer"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.role ? "border-red-500" : "border-gray-300 focus:border-red-900"}`}
          />
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
          )}
        </div>

        {/* Image URL Input (DITAMBAHKAN AGAR COCOK DENGAN PRISMA) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Image URL
          </label>
          <input
            name="image"
            type="text"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.jpg"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.image ? "border-red-500" : "border-gray-300 focus:border-red-900"}`}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/speakers")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={createSpeakerMutation.isPending}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {createSpeakerMutation.isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}