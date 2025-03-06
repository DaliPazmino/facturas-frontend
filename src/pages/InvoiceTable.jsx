import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:7000/invoices/")
      .then((response) => {
        setInvoices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
      });
  }, []);

  console.log(invoices);

  const handlePay = (invoiceId) => {
    console.log(invoiceId);
    navigate(`/pay/${invoiceId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Facturas</h2>
      <table className="w-full ">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Cliente</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Saldo Restante</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{invoice.client.name}</td>
              <td className="border p-2">${invoice.total.toFixed(2)}</td>
              <td className="border p-2">
                ${invoice.remaining_balance.toFixed(2)}
              </td>
              <td
                className={`border p-2 ${
                  invoice.status === "pagada"
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }`}
              >
                {invoice.status}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handlePay(invoice.id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Pagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
