import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";

const backendUrl = import.meta.env.VITE_API_URL;

const FacturacionApp = () => {
  const [invoices, setInvoices] = useState([]);
  const [client, setClient] = useState({ estado: "Pendiente" });
  const [products, setProducts] = useState([
    { name: "Producto 1", price: 50.0, quantity: 2 },
    { name: "Producto 2", price: 30.0, quantity: 3 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0.0, quantity: 1 });
  const [ivaRate] = useState(12.0);
  const [isPopoverVisible, setPopoverVisible] = useState(false);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const response = await axios.get(`${backendUrl}/invoices/`);
        setInvoices(response.data);
      } catch (error) {
        console.error("Error obteniendo facturas", error);
      }
    };
    getInvoices();
  }, []);

  const handleClientChange = (e) => setClient({ ...client, [e.target.id]: e.target.value });

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const invoice = { client, products, iva_rate: ivaRate };

    try {
      const response = await axios.post(`${backendUrl}/create_invoice/`, invoice);
      Swal.fire({
        title: "Factura Creada",
        text: `Factura para ${response.data.invoice.client.name} creada exitosamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear la factura.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const calculateTotals = () => {
    const subtotal = products.reduce((acc, prod) => acc + prod.price * prod.quantity, 0);
    const ivaAmount = (subtotal * ivaRate) / 100;
    return { subtotal, ivaAmount, total: subtotal + ivaAmount };
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price <= 0 || newProduct.quantity <= 0) {
      alert("Por favor, complete todos los campos del producto correctamente.");
      return;
    }
    setProducts([...products, newProduct]);
    setNewProduct({ name: "", price: 0.0, quantity: 1 });
    setPopoverVisible(false);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-100 p-8 text-black">
      <div className="container mx-auto">
        {/* Crear Factura */}
        <div className="bg-white p-4 mb-8 rounded-lg shadow-lg">
          <h2 className="font-bold text-3xl mb-4 ">Crear Factura</h2>
          <form onSubmit={handleCreateInvoice}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 font-semibold">
              <div className="mb-4">
                <label htmlFor="cedula" className="block">
                  Cedula
                </label>
                <input
                  type="text"
                  id="cedula"
                  className="w-full p-2 border rounded"
                  value={client.cedula}
                  onChange={handleClientChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded"
                  value={client.name}
                  onChange={handleClientChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded"
                  value={client.email}
                  onChange={handleClientChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block">
                  Dirección
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full p-2 border rounded"
                  value={client.address}
                  onChange={handleClientChange}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="clientEstado" className="block">
                  Estado
                </label>
                <input
                  type="text"
                  id="clientEstado"
                  className="w-full p-2 border rounded"
                  value={client.estado}
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-between items-center py-3">
              <h3 className="text-lg mt-4 font-bold">Productos</h3>
              <button
                type="button"
                className="mt-4 bg-blue-500 text-white p-2 rounded flex items-center justify-center"
                onClick={() => setPopoverVisible(true)}
              >
                <Plus size={18} className="mr-2" />
                Agregar Producto
              </button>
            </div>

            <div className="overflow-x-auto p-3">
              <table className="min-w-full bg-white ">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 text-left">Nombre</th>
                    <th className="p-2 text-left">Precio</th>
                    <th className="p-2 text-left">Cantidad</th>
                    <th className="p-2 text-left">Total</th>
                    <th className="p-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">${product.price.toFixed(2)}</td>
                      <td className="p-2">{product.quantity}</td>
                      <td className="p-2">
                        ${(product.price * product.quantity).toFixed(2)}
                      </td>
                      <td className="p-2">
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Popover para agregar un nuevo producto */}
            {isPopoverVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
                <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out">
                  <h3 className="text-lg mb-4">Agregar Producto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="productName" className="block">
                        Nombre del Producto
                      </label>
                      <input
                        type="text"
                        id="productName"
                        className="w-full p-2 border rounded"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="productPrice" className="block">
                        Precio
                      </label>
                      <input
                        type="number"
                        id="productPrice"
                        className="w-full p-2 border rounded"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor="productQuantity" className="block">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        id="productQuantity"
                        className="w-full p-2 border rounded"
                        value={newProduct.quantity}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            quantity: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between space-x-2">
                    <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded"
                      onClick={handleAddProduct}
                    >
                      Agregar Producto
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 text-white p-2 rounded"
                      onClick={() => setPopoverVisible(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4 flex justify-between">
              <label htmlFor="ivaRate" className="block font-bold">
                Tasa de IVA (%)
              </label>
              <input
                type="number"
                id="ivaRate"
                className="w-20 p-2 border rounded"
                value={ivaRate}
                readOnly
              />
            </div>

            <div className="mt-4 p-4 bg-gray-200 rounded">
              <p className="font-bold">
                Subtotal: ${calculateTotals().subtotal.toFixed(2)}
              </p>
              <p className="font-bold">
                IVA (${ivaRate}%): ${calculateTotals().ivaAmount.toFixed(2)}
              </p>
              <p className="font-bold text-xl">
                Total: ${calculateTotals().total.toFixed(2)}
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Crear Factura
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacturacionApp;
