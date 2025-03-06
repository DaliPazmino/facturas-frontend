import "./App.css";
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import FacturacionApp from "./pages/FacturacionApp";
import InvoiceTable from "./pages/InvoiceTable";
import PaymentPage from "./pages/PaymentPage";
function App() {
  return (
    <div className=" ">
      <nav className="bg-blue-500 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-semibold">APP</div>
          <div className="space-x-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Inicio
            </Link>
            <Link
              to="/detallesFacturas"
              className="text-white hover:text-gray-300"
            >
              Detalles de Facturas
            </Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<FacturacionApp />} />
        <Route path="/detallesFacturas" element={<InvoiceTable />} />
        <Route path="/pay/:invoiceId" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App;
