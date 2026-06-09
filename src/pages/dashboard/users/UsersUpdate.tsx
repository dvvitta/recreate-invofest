import { useEffect, useState } from "react";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserById, useUpdateUser } from "../../../Hooks/useAuth"; 
import toast from "react-hot-toast"; 

const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").or(z.literal("")).optional(),
});

export default function UserUpdate() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const { data: userBackend, isLoading: isLoadingFetch, isError } = useGetUserById(id);
  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", 
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userBackend) {
      setFormData({
        name: userBackend.name,
        email: userBackend.email,
        password: "", 
      });
    }
  }, [userBackend]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSave = () => {
    const result = userUpdateSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Tolong periksa kembali data form jéh!", { id: "validation-error" });
    } else {
      setErrors({});

      if (!id) return;

      const updatePayload: Record<string, any> = {
        id: id,
        name: result.data.name,
        email: result.data.email,
      };

      if (result.data.password) {
        updatePayload.password = result.data.password;
      }

      const updatePromise = new Promise((resolve, reject) => {
        updateUserMutation.mutate(updatePayload as any, {
          onSuccess: () => {
            resolve(`User "${formData.name}" berhasil diperbarui!`);
            setTimeout(() => {
              navigate("/dashboard/users");
            }, 1000);
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Gagal memperbarui data user.";
            reject(errorMessage);
          },
        });
      });

      toast.promise(updatePromise, {
        loading: "Sedang memperbarui data user...",
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

  if (isLoadingFetch) {
    return (
      <div className="flex justify-center items-center py-24 gap-2">
        <div className="w-5 h-5 border-2 border-red-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading user data from server...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
        <p className="text-red-600 font-medium mb-4">Gagal memuat data user.</p>
        <button 
          onClick={() => navigate("/dashboard/users")}
          className="text-sm font-semibold text-gray-600 hover:underline"
        >
          Kembali ke Manajemen User
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Update User Details</h2>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            type="text"
            disabled={updateUserMutation.isPending}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${updateUserMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            disabled={updateUserMutation.isPending}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${updateUserMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            New Password <span className="text-gray-400 font-normal text-xs">(Leave blank to keep current)</span>
          </label>
          <input
            name="password"
            type="password"
            disabled={updateUserMutation.isPending}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${updateUserMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={updateUserMutation.isPending}
            onClick={() => navigate("/dashboard/users")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateUserMutation.isPending}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {updateUserMutation.isPending ? "Updating..." : "Update User"}
          </button>
        </div>
      </div>
    </div>
  );
}