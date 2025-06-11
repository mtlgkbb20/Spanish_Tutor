import React from "react";                 // 👈 satırı ekle
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Welcome       from "./pages/Welcome";
import Dashboard     from "./pages/Dashboard";
import ModuleDetail  from "./pages/ModuleDetail";
import Profile       from "./pages/Profile";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/"            element={<Welcome />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/module/:level/:idx" element={<ModuleDetail />} />
        <Route path="/profile"     element={<Profile />} />
        {/* diğer sekmeler için boş sayfa ekleyebilirsiniz */}
      </Routes>
    </>
  );
}
