import React from "react";                 // 👈 satırı ekle
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Welcome       from "./pages/Welcome";
import Dashboard     from "./pages/Dashboard";
import ModuleDetail  from "./pages/ModuleDetail";
import Profile       from "./pages/Profile";
import { ThemeProvider } from "@mui/material/styles";
import Content from "./pages/Content";
import QuizzesAssignments from "./pages/QuizzesAssignments";
import Notifications from "./pages/Notifications";
import theme from "./theme";


export default function App() {
  return (
    <>
    <ThemeProvider theme={theme}> 
      <Routes>
        <Route path="/"            element={<Welcome />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/module/:level/:idx" element={<ModuleDetail />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/content/:level/:idx" element={<Content />}/>
        <Route path="/quizzes-assignments/:level/:idx" element={<QuizzesAssignments />}/>
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </ThemeProvider>
    </>
  );
}
