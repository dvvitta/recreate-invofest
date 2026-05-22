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
import EventEdit from "./pages/dashboard/Event/EventUpdate";
import CategoryEdit from "./pages/dashboard/category/categoryUpdate";
import SpeakersUpdate from "./pages/dashboard/speakers/SpeakersUpdate"; 

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Main Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Beranda />} />
            <Route path="/seminar" element={<Seminar />} />
            <Route path="/competition" element={<Competition />} />
            <Route path="/workshop" element={<Workshop />} />
            <Route path="/talkshow" element={<Talkshow />} />
          </Route>

          {/* Authentication Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
          </Route>

          {/* Protected Routes (Dashboard) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Dashboard Home */}
              <Route path="/dashboard" element={<DashboardIndex />} />
              
              <Route path="/dashboard/category" element={<CategoryIndex />} />
              <Route path="/dashboard/category/create" element={<CategoryCreate />} />
              <Route path="/dashboard/category/edit/:id" element={<CategoryEdit />} />

              <Route path="/dashboard/event" element={<EventIndex />} />
              <Route path="/dashboard/event/create" element={<EventCreate />} />
              <Route path="/dashboard/event/edit/:id" element={<EventEdit />} />

              <Route path="/dashboard/speakers" element={<SpeakersIndex />} />
              <Route path="/dashboard/speakers/create" element={<SpeakersCreate />} />
              <Route path="/dashboard/speakers/edit/:id" element={<SpeakersUpdate />} /> 
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;