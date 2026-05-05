import { BrowserRouter, Route, Routes } from "react-router-dom";
import Beranda from "./pages/Beranda";
import Seminar from "./pages/Seminar";
import Competition from "./pages/Competition";
import Workshop from "./pages/Workshop";
import Talkshow from "./pages/Talkshow";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import CategoryIndex from "./pages/dashboard/category/CategoryIndex";
import EventIndex from "./pages/dashboard/Event/EventIndex";
import CategoryCreate from "./pages/dashboard/category/CategoryCreate";
import SpeakersIndex from "./pages/dashboard/speakers/SpeakersIndex";
import EventCreate from "./pages/dashboard/Event/EventCreate";
import SpeakersCreate from "./pages/dashboard/speakers/SpeakersCreate";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/seminar" element={<Seminar />} />
            <Route path="/competition" element={<Competition />} />
            <Route path="/workshop" element={<Workshop />} />
            <Route path="/talkshow" element={<Talkshow />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardIndex />} />
              <Route path="/dashboard/category" element={<CategoryIndex />} />
              <Route path="/dashboard/category/create" element={<CategoryCreate />} />
              <Route path="/dashboard/event" element={<EventIndex />} />
              <Route path="/dashboard/speakers" element={<SpeakersIndex />} />
              <Route path="/dashboard/event/create" element={<EventCreate />} />
              <Route path="/dashboard/speakers/create" element={<SpeakersCreate />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
