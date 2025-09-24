import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { InventarioPage } from "../pages/Inventario";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InventarioPage />} />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}