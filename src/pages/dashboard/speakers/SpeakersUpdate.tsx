import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetSpeakerById,
  useUpdateSpeaker,
} from "../../../Hooks/useSpeakers";
import toast from "react-hot-toast"; 

const speakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required"),
  role: z.string().min(1, "Role is required"),
  image: z
    .string()
    .url("Must be a valid image URL")
    .min(1, "Speaker image URL is required"),
});

export default function SpeakersUpdate() {
  const { id } = useParams<{ id: string }>();
  const speakerId = Number(id);

  const navigate = useNavigate();

  const {
    data: currentSpeaker,
    isLoading,
    isError,
  } = useGetSpeakerById(speakerId);
  const updateSpeakerMutation = useUpdateSpeaker();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentSpeaker) {
      setFormData({
        name: currentSpeaker.name,
        role: currentSpeaker.role,
        image: currentSpeaker.image,
      });
    }
  }, [currentSpeaker]);

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
      toast.error("Tolong periksa kembali isi form!", { id: "validation-update-speaker" });
    } else {
      setErrors({});

      const updateSpeakerPromise = new Promise((resolve, reject) => {
        updateSpeakerMutation.mutate(
          {
            id: speakerId,
            updatedData: result.data,
          },
          {
            onSuccess: () => {
              resolve(`Data pembicara "${formData.name}" berhasil diperbarui!`);
              setTimeout(() => {
                navigate("/dashboard/speakers");
              }, 1000);
            },
            onError: (error: any) => {
              const errorMessage = error.response?.data?.message || error.message || "Gagal memperbarui data speaker.";
              reject(errorMessage);
            },
          },
        );
      });

      toast.promise(updateSpeakerPromise, {
        loading: "Sedang memperbarui data pembicara...",
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-24 gap-2">
        <div className="w-5 h-5 border-2 border-red-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Memuat data pembicara lama...</p>
      </div>
    );

  if (isError)
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
        <p className="text-red-600 font-medium mb-4">Gagal memuat data. Pembicara tidak ditemukan.</p>
        <button 
          onClick={() => navigate("/dashboard/speakers")}
          className="text-sm font-semibold text-gray-600 hover:underline"
        >
          Kembali ke Manajemen Speaker
        </button>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
        Edit Speaker Details
      </h2>

      <div className="flex flex-col gap-4">
        {formData.image && !errors.image && (
          <div className="flex justify-center mb-2">
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-full border border-gray-200 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Speaker Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            type="text"
            disabled={updateSpeakerMutation.isPending}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. John Doe"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${updateSpeakerMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
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
            disabled={updateSpeakerMutation.isPending}
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g. Senior Web Developer"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.role ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${updateSpeakerMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
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
            disabled={updateSpeakerMutation.isPending}
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.jpg"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.image ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${updateSpeakerMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={updateSpeakerMutation.isPending}
            onClick={() => navigate("/dashboard/speakers")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateSpeakerMutation.isPending}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {updateSpeakerMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}