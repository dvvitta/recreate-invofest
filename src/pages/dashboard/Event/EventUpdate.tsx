import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEventById, useUpdateEvent } from "../../../Hooks/useEvent"; // Sesuaikan path hooks kamu
import { useGetCategories } from "../../../Hooks/useCategories"; // Hook ambil kategori
import { useGetSpeakers } from "../../../Hooks/useSpeakers";

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  category: z.string().min(1, "Category is required"),
  speaker: z.string().min(1, "Speaker is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function EventUpdate() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();

  // 1. Ambil data event lama, list kategori, dan list speaker dari server
  const { data: currentEvent, isLoading: isLoadingEvent, isError } = useGetEventById(eventId);
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();
  const { data: speakers, isLoading: isLoadingSpeakers } = useGetSpeakers();

  const updateEventMutation = useUpdateEvent();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    speaker: "",
    date: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Masukkan data event lama ke dalam form secara otomatis begitu berhasil di-load
  useEffect(() => {
    if (currentEvent) {
      // Ambil format YYYY-MM-DD dari string ISO date agar bisa dibaca input type="date"
      const formattedDate = currentEvent.dateEvent 
        ? currentEvent.dateEvent.split("T")[0] 
        : "";

      setFormData({
        name: currentEvent.name || "",
        category: String(currentEvent.categoryId || ""),
        speaker: String(currentEvent.speakerId || ""),
        date: formattedDate,
        location: currentEvent.location || "",
        description: currentEvent.description || "",
      });
    }
  }, [currentEvent]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

      const payload = {
        name: result.data.name,
        location: result.data.location,
        description: result.data.description,
        dateEvent: new Date(result.data.date).toISOString(),
        categoryId: Number(result.data.category),
        speakerId: Number(result.data.speaker),
      };

      // Jalankan mutasi update data ke backend via React Query
      updateEventMutation.mutate(
        { id: eventId, updatedData: payload },
        {
          onSuccess: () => {
            alert("Perubahan data event berhasil disimpan!");
            navigate("/dashboard/event");
          },
          onError: (error: any) => {
            alert(`Gagal memperbarui: ${error?.response?.data?.message || error.message}`);
          },
        }
      );
    }
  };

  if (isLoadingEvent) return <div className="text-center mt-10 text-gray-500">Memuat detail event...</div>;
  if (isError) return <div className="text-center mt-10 text-red-600">Gagal memuat data. Event tidak ditemukan.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Edit Event Details</h2>

      <div className="flex flex-col gap-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Event Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Event Name"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-white outline-none cursor-pointer ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoadingCategories}
          >
            <option value="">
              {isLoadingCategories ? "Memuat kategori..." : "-- Pilih Kategori Event --"}
            </option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Speaker Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Speaker
          </label>
          <select
            name="speaker"
            value={formData.speaker}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-white outline-none cursor-pointer ${
              errors.speaker ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoadingSpeakers}
          >
            <option value="">
              {isLoadingSpeakers ? "Memuat pembicara..." : "-- Pilih Speaker Event --"}
            </option>
            {speakers?.map((spk) => (
              <option key={spk.id} value={spk.id}>
                {spk.name} ({spk.role})
              </option>
            ))}
          </select>
          {errors.speaker && (
            <p className="text-red-500 text-xs mt-1">{errors.speaker}</p>
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
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.date ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Location
          </label>
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.location ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add description"
            className={`w-full px-4 py-2 border rounded-lg outline-none h-24 ${errors.description ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/event")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateEventMutation.isPending || isLoadingCategories || isLoadingSpeakers}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {updateEventMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}