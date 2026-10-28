import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import ThemeStudio from "./Pages/ThemeStudio";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/app.css";

export default function App() {
  return <ThemeProvider><Routes><Route element={<AppLayout />}><Route index element={<Navigate to="/dashboard" replace />} /><Route path="dashboard" element={<Dashboard />} /><Route path="users" element={<Users />} /><Route path="theme" element={<ThemeStudio />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes></ThemeProvider>;
}
