import Header from "../components/Header";
import Footer from "../components/ui/Footer"; // Pastikan path ini benar!
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}