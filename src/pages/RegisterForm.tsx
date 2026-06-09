import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputText from "../components/ui/InputText";
import InputPassword from "../components/ui/InputPassword";
import Button from "../components/ui/Button";
import { z } from "zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUser } from "../Hooks/useAuth";
import toast from "react-hot-toast";

type FormData = {
  nama: string;
  email: string;
  password: string;
  password_confirm: string;
  kategori: string;
  bio: string;
};

const schema = z
  .object({
    nama: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Format email salah"),
    password: z.string().min(8, "Minimal 8 karakter"),
    password_confirm: z.string(),
    kategori: z.string().min(1, "Pilih kategori event"),
    bio: z.string().min(10, "Bio minimal 10 karakter"),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Password tidak sama",
    path: ["password_confirm"],
  });

const kategoriOptions = [
  { label: "IT Seminar", value: "seminar" },
  { label: "IT Workshop", value: "workshop" },
  { label: "IT Talkshow", value: "talkshow" },
  { label: "IT Competition", value: "competition" },
];

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const createUserMutation = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    const registerPayload = {
      name: data.nama,
      email: data.email,
      password: data.password,
    };

    const registerPromise = new Promise((resolve, reject) => {
      createUserMutation.mutate(registerPayload, {
        onSuccess: () => {
          reset();
          resolve(`Akun "${data.nama}" berhasil dibuat! Mengalihkan...`);

          setTimeout(() => {
            navigate("/login");
          }, 1500);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message ||
            "Registrasi gagal, terjadi kesalahan.";
          reject(errorMessage);
        },
      });
    });

    toast.promise(
      registerPromise,
      {
        loading: "Sedang membuat akun baru...",
        success: (msg: any) => `${msg}`,
        error: (err: any) => `${err}`,
      },
      {
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
          fontSize: "14px",
        },
        success: {
          duration: 2500,
          iconTheme: {
            primary: "#7f1d1d",
            secondary: "#fff",
          },
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputText
          label="Nama Lengkap"
          nama="nama"
          disabled={createUserMutation.isPending}
          register={register}
          error={errors.nama?.message}
        />
        <InputText
          label="Email"
          nama="email"
          type="email"
          disabled={createUserMutation.isPending}
          register={register}
          error={errors.email?.message}
        />
        <InputPassword
          label="Password"
          nama="password"
          disabled={createUserMutation.isPending}
          register={register}
          error={errors.password?.message}
        />
        <InputPassword
          label="Confirm Password"
          nama="password_confirm"
          disabled={createUserMutation.isPending}
          register={register}
          error={errors.password_confirm?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Event Category
          </label>
          <div className="relative w-full">
            <select
              {...register("kategori", {
                disabled: createUserMutation.isPending,
              })}
              onClick={() =>
                !createUserMutation.isPending && setIsOpen(!isOpen)
              }
              onBlur={() => setIsOpen(false)}
              className={`w-full p-3 bg-white rounded-xl border outline-none appearance-none transition-all focus:ring-2 focus:ring-red-200 relative z-10 cursor-pointer ${
                errors.kategori ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${createUserMutation.isPending ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            >
              <option value="">Select event category..</option>
              {kategoriOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div
              className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 z-20 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
            >
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          {errors.kategori && (
            <p className="text-red-500 text-xs">{errors.kategori.message}</p>
          )}
        </div>

        {/* Textarea Bio dengan Native Register Handling */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Bio</label>
          <textarea
            {...register("bio", { disabled: createUserMutation.isPending })}
            className={`p-3 rounded-xl border outline-none h-20 transition-all focus:ring-2 focus:ring-red-200 ${
              errors.bio ? "border-red-500 bg-red-50" : "border-gray-300"
            } ${createUserMutation.isPending ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
            placeholder="Ceritakan tentang diri Anda..."
          />
          {errors.bio && (
            <p className="text-red-500 text-xs">{errors.bio.message}</p>
          )}
        </div>

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            label="Register"
            loading={createUserMutation.isPending}
            variant="primary"
          />
        </div>
      </form>

      <p className="mt-6 text-sm text-center text-gray-500">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-red-900 font-bold hover:underline">
          Login disini
        </Link>
      </p>
    </div>
  );
}
