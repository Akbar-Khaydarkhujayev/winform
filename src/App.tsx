import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LocationsPage from "./pages/LocationsPage";
import StudentsPage from "./pages/StudentsPage";
import ObjectsPage from "./pages/ObjectsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "#1D1D29",
            border: "1px solid #2E2E3A",
            color: "#FFFFFF",
          },
        }}
      />
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <LoginPage />}
          />
        </Route>

        {/* Protected routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/objects" element={<ObjectsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
