import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useCreateUser } from "../../../Hooks/useAuth"; 
import toast from "react-hot-toast"; 

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Must be a valid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function UserCreate() {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSave = () => {
    const result = userSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Tolong lengkapi form dengan benar jéh!", { id: "validation-error" });
    } else {
      setErrors({});

      const savePromise = new Promise((resolve, reject) => {
        createUserMutation.mutate(result.data, {
          onSuccess: () => {
            resolve(`User "${formData.name}" berhasil disimpan!`);
            setTimeout(() => {
              navigate("/dashboard/users");
            }, 1000);
          },
          onError: (error: any) => {
            const errorMessage = error.response?.data?.message || "Gagal menyimpan user baru.";
            reject(errorMessage);
          },
        });
      });

      toast.promise(savePromise, {
        loading: "Sedang menyimpan user...",
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
      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Add New User</h2>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            type="text"
            disabled={createUserMutation.isPending}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.name ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${createUserMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
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
            disabled={createUserMutation.isPending}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${createUserMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            disabled={createUserMutation.isPending}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${
              errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-red-900"
            } ${createUserMutation.isPending ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            disabled={createUserMutation.isPending}
            onClick={() => navigate("/dashboard/users")}
            className="border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={createUserMutation.isPending}
            className="bg-red-900 text-white font-semibold py-2.5 px-8 rounded-lg hover:bg-red-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
          >
            {createUserMutation.isPending ? "Saving..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}