import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateSpeaker } from "../../../Hooks/useSpeakers";
import toast from "react-hot-toast"; 

const speakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required"),
  role: z.string().min(1, "Role is required"),
  image: z
    .string()
    .url("Must be a valid image URL")
    .min(1, "Speaker image URL is required"),
});

export default function SpeakerCreate() {
  const navigate = useNavigate();
  const createSpeakerMutation = useCreateSpeaker();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
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
      toast.error("Tolong isi semua form dengan benar!", { id: "validation-speaker-error" });
    } else {
      setErrors({});

      const saveSpeakerPromise = new Promise((resolve, reject) => {
        createSpeakerMutation.mutate(result.data, {
          onSuccess: () => {
            resolve(`Speaker "${formData.name}" berhasil disimpan!`);
            setTimeout(() => {
              navigate("/dashboard/speakers");
            }, 1000);
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || error.message || "Gagal menyimpan data speaker.";
            reject(errorMessage);
          },
        });
      });

      toast.promise(saveSpeakerPromise, {
        loading: "Sedang menambahkan speaker baru...",
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
        Add New Speaker
      </h2>

      <div className="flex flex-col gap-4">
        {/* Speaker Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            type="text"
            disabled={createSpeakerMutation.isPending}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${createSpeakerMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
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
            disabled={createSpeakerMutation.isPending}
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g. Senior Web Developer"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.role ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${createSpeakerMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
          )}
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Image URL
          </label>
          <input
            name="image"
            type="text"
            disabled={createSpeakerMutation.isPending}
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.jpg"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.image ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${createSpeakerMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={createSpeakerMutation.isPending}
            onClick={() => navigate("/dashboard/speakers")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={createSpeakerMutation.isPending}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {createSpeakerMutation.isPending ? "Adding..." : "Add Speaker"}
          </button>
        </div>
      </div>
    </div>
  );
}