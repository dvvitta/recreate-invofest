import { useForm } from "react-hook-form";
import InputText from "../components/ui/InputText";
import InputPassword from "../components/ui/InputPassword";
import Button from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../store/useAuthStore";

const schema = z.object({
  email: z.string().min(1, "Email wajib diisi"),
  password: z.string().min(8, "Minimal 8 karakter"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    if (data.email === "admin@gmail.com" && data.password === "password") {
      alert("Login berhasil!");
      login(data.email);
      navigate("/dashboard");
    } else {
      alert("Login gagal! Email atau password salah.");
      return;
    }
  };

  return (
    <div className="justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center  mb-6 ">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <InputText
            label="Email"
            nama="email"
            register={register}
            error={errors.email?.message}
          />

          <InputPassword
            label="Password"
            nama="password"
            register={register}
            error={errors.password?.message}
          />
          <div className="flex justify-center w-full">
            <Button type="submit" label="Login" variant="primary" />
          </div>
        </form>

        <p className="mt-6 text-sm text-center text-slate-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-red-900 font-semibold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
