import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSpeakerById, useUpdateSpeaker } from "../../../Hooks/useSpeakers"; // Sesuaikan path relative ke hooks kamu

// Schema Zod untuk validasi data Speaker saat update
const speakerSchema = z.object({
  name: z.string().min(1, "Speaker name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().url("Must be a valid image URL").min(1, "Speaker image URL is required"),
});

export default function SpeakersUpdate() {
  const { id } = useParams<{ id: string }>(); // Tangkap ID pembicara dari URL
  const speakerId = Number(id); // Konversi ke tipe number (Int Prisma)

  const navigate = useNavigate();

  // Fetch data pembicara lama & panggil fungsi mutasi update
  const { data: currentSpeaker, isLoading, isError } = useGetSpeakerById(speakerId);
  const updateSpeakerMutation = useUpdateSpeaker();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Isi form secara otomatis begitu data pembicara lama berhasil ditarik dari Railway
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
    } else {
      setErrors({});

      // Jalankan mutasi update data ke API backend Railway
      updateSpeakerMutation.mutate(
        {
          id: speakerId,
          updatedData: result.data,
        },
        {
          onSuccess: () => {
            alert(`Data pembicara "${formData.name}" berhasil diperbarui!`);
            navigate("/dashboard/speakers"); // Balik ke halaman list utama pembicara
          },
          onError: (error: any) => {
            alert(`Gagal memperbarui data: ${error?.response?.data?.message || error.message}`);
          },
        }
      );
    }
  };

  if (isLoading) return <div className="text-center mt-10 text-gray-500">Memuat data pembicara lama...</div>;
  if (isError) return <div className="text-center mt-10 text-red-600">Gagal memuat data. Pembicara tidak ditemukan.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Edit Speaker Details</h2>

      <div className="flex flex-col gap-4">
        {/* Preview Avatar Saat Ini */}
        {formData.image && !errors.image && (
          <div className="flex justify-center mb-2">
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-full border border-gray-200 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'; // Sembunyikan preview jika URL salah sewaktu mengetik
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

        {/* Image URL Input */}
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