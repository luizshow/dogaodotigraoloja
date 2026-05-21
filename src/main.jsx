import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminCadastro from "./admin/AdminCadastro.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProdutos from "./admin/AdminProdutos.jsx";
import AdminCategorias from "./admin/AdminCategorias.jsx";
import ProtectedRoute from "./admin/ProtectedRoute.jsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/cadastro" element={<AdminCadastro />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/produtos" element={<ProtectedRoute><AdminProdutos /></ProtectedRoute>} />
        <Route path="/admin/categorias" element={<ProtectedRoute><AdminCategorias /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
