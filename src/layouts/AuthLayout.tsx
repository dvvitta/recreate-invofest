import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="bg-red-900 flex flex-col items-center justify-center p-12 text-white">
        <div className="bg-white p-8 rounded-3xl shadow-2xl mb-8">
          <img
            src="https://www.invofest-harkatnegeri.com/assets/nav-logo.png"
            alt="Invofest Logo"
            className="w-64 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-red-200 mt-2 text-lg">
          Please login to your account
        </p>
      </div>

      {/* Kanan: Auth Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
