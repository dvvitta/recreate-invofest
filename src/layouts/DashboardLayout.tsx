import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function DashboardLayout() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200 p-6 h-screen flex flex-col justify-between sticky top-0 shadow-sm">
        <div>
          <div className="mb-8 text-center">
            <h2 className="font-bold text-xl text-red-900 tracking-tight pb-4 border-b border-gray-200">
              INVOFEST
            </h2>
          </div>

          <div className="flex flex-col gap-2 text-gray-600 font-medium">
            <Link
              to="/dashboard"
              className={`p-3 rounded-lg transition-all ${isActive("/dashboard") ? "bg-red-50 text-red-900 font-semibold" : "hover:bg-red-50 hover:text-red-900"}`}
            >
              Dashboard
            </Link>
            <Link
              to="/dashboard/category"
              className={`p-3 rounded-lg transition-all ${isActive("/dashboard/category") ? "bg-red-50 text-red-900 font-semibold" : "hover:bg-red-50 hover:text-red-900"}`}
            >
              Category
            </Link>
            <Link
              to="/dashboard/event"
              className={`p-3 rounded-lg transition-all ${isActive("/dashboard/event") ? "bg-red-50 text-red-900 font-semibold" : "hover:bg-red-50 hover:text-red-900"}`}
            >
              Event
            </Link>
            <Link
              to="/dashboard/speakers"
              className={`p-3 rounded-lg transition-all ${isActive("/dashboard/speakers") ? "bg-red-50 text-red-900 font-semibold" : "hover:bg-red-50 hover:text-red-900"}`}
            >
              Speakers
            </Link>
            
            {/* TAMBAHKAN LINK MENU BIODATA DI SINI */}
            <Link
              to="/dashboard/biodata"
              className={`p-3 rounded-lg transition-all ${isActive("/dashboard/biodata") ? "bg-red-50 text-red-900 font-semibold" : "hover:bg-red-50 hover:text-red-900"}`}
            >
              Biodata
            </Link>
          </div>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="bg-red-900 text-white w-full py-2.5 rounded-lg font-semibold hover:bg-red-800 transition-all active:scale-[0.98] shadow-md"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}