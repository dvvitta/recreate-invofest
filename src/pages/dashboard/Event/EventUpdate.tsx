import { useState, useEffect } from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEventById, useUpdateEvent } from "../../../Hooks/useEvent"; // Sesuaikan path hooks kamu

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  category: z.string().min(1, "Category ID must be a number"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function EventEdit() {
  const { id } = useParams<{ id: string }>(); // Ambil ID dari URL router
  const eventId = Number(id); // Konversi string ID ke number

  const navigate = useNavigate();
  
  // Fetch data lama dan panggil fungsi mutasi update
  const { data: currentEvent, isLoading, isError } = useGetEventById(eventId);
  const updateEventMutation = useUpdateEvent();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    date: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Isi data form secara otomatis begitu data dari backend Railway sukses dimuat
  useEffect(() => {
    if (currentEvent) {
      setFormData({
        name: currentEvent.name,
        category: String(currentEvent.categoryId),
        // Potong string ISO (YYYY-MM-DDTHH:mm:ss.zzzZ) agar pas dengan format input type="date" (YYYY-MM-DD)
        date: currentEvent.dateEvent ? currentEvent.dateEvent.split("T")[0] || "" : "",
        location: currentEvent.location,
        description: currentEvent.description,
      });
    }
  }, [currentEvent]);

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

      const updatedPayload = {
        name: result.data.name,
        location: result.data.location,
        description: result.data.description,
        dateEvent: new Date(result.data.date).toISOString(), // Format DateTime Prisma
        categoryId: Number(result.data.category), // Format Int Prisma
        speakerId: currentEvent?.speakerId || 1, // Pertahankan speakerId lama atau beri default
      };

      // Eksekusi update data ke backend Railway
      updateEventMutation.mutate(
        { id: eventId, updatedData: updatedPayload },
        {
          onSuccess: () => {
            alert("Event berhasil diperbarui!");
            navigate("/dashboard/event"); // Balik ke halaman utama tabel
          },
          onError: (error: any) => {
            alert(`Gagal memperbarui: ${error?.response?.data?.message || error.message}`);
          },
        }
      );
    }
  };

  if (isLoading) return <div className="text-center mt-10 text-gray-500">Memuat data event lama...</div>;
  if (isError) return <div className="text-center mt-10 text-red-600">Gagal memuat data. Event tidak ditemukan.</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Edit Event</h2>

      <div className="flex flex-col gap-4">
        {/* Event Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Event Name"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category ID (Number)</label>
          <input
            name="category"
            type="number"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Masukkan ID Kategori"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.category ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.date ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input
            name="location"
            type="text"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Location"
            className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.location ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Add new description"
            className={`w-full px-4 py-2 border rounded-lg outline-none h-24 ${errors.description ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Save Button & Cancel */}
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
            disabled={updateEventMutation.isPending}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {updateEventMutation.isPending ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}