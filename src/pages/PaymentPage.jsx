import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function PaymentPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [amountPaid, setAmountPaid] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:7000/invoice/${invoiceId}`)
      .then((response) => setInvoice(response.data))
      .catch((error) => {
        Swal.fire("Error", "Error cargando factura", "error");
      });
  }, [invoiceId]);

  const handlePayment = async () => {
    if (!amountPaid || amountPaid <= 0) {
      Swal.fire("Advertencia", "Ingrese un monto válido", "warning");
      return;
    }

    Swal.fire({
      title: "Procesando pago...",
      text: "Por favor, espera",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        `http://localhost:7000/pay_invoice/${invoiceId}`,
        {
          method: paymentMethod,
          amount_paid: parseFloat(amountPaid),
        }
      );

      Swal.fire({
        title: "Éxito",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/detallesFacturas");
      });
    } catch (error) {
      Swal.fire("Error", "Error al procesar el pago", "error");
    }
  };

  if (!invoice) return <p>Cargando factura...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold">Pagar Factura</h2>
      <p>
        <strong>Cliente:</strong> {invoice.client.name}
      </p>
      <p>
        <strong>Total:</strong> ${invoice.total.toFixed(2)}
      </p>
      <p>
        <strong>Saldo Pendiente:</strong> $
        {invoice.remaining_balance.toFixed(2)}
      </p>
      <p>
        <strong>Estado:</strong> {invoice.status}
      </p>

      <div className="mt-4">
        <label className="block font-semibold">Método de Pago:</label>
        <div className="flex justify-center gap-4">
          <label>
            <input
              type="radio"
              value="efectivo"
              checked={paymentMethod === "efectivo"}
              onChange={() => setPaymentMethod("efectivo")}
            />
            Efectivo
          </label>
          <label>
            <input
              type="radio"
              value="tarjeta"
              checked={paymentMethod === "tarjeta"}
              onChange={() => setPaymentMethod("tarjeta")}
            />
            Tarjeta
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Monto a Pagar:</label>
        <input
          type="number"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handlePayment}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Realizar Pago
      </button>
    </div>
  );
}

export default PaymentPage;
