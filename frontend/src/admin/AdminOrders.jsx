import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    if (useBackend) {
      try {
        const res = await apiFetch("/api/orders");
        const data = await res.json();
        setOrders(data || []);
        return;
      } catch (err) {
        console.log("Backend failed to load orders");
      }
    }

    let allOrders = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.includes("orders_")) {
        const userOrders =
          JSON.parse(localStorage.getItem(key)) || [];

        allOrders = [...allOrders, ...userOrders];
      }
    }

    setOrders(allOrders);
  };

  // ✅ STATUS UPDATE (ONLY FIX: re-render)
  // ✅ STATUS UPDATE
  const handleStatusChange = async (orderId, newStatus) => {
    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    if (useBackend) {
      try {
        const res = await apiFetch(`/api/orders/${orderId}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: newStatus })
        });
        if (!res.ok) {
          alert("Failed to update status on backend");
          return;
        }
        loadOrders();
        return;
      } catch (err) {
        alert("Error updating order status");
        return;
      }
    }

    let updatedOrders = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.includes("orders_")) {
        const userOrders =
          JSON.parse(localStorage.getItem(key)) || [];

        const updatedUserOrders = userOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        );

        localStorage.setItem(
          key,
          JSON.stringify(updatedUserOrders)
        );

        updatedOrders = [
          ...updatedOrders,
          ...updatedUserOrders,
        ];
      }
    }

    setOrders([...updatedOrders]); // ✅ FIX
  };

  // ✅ ACTION FIX
  const handleQuickUpdate = async (orderId) => {
    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    if (useBackend) {
      try {
        const res = await apiFetch(`/api/orders/${orderId}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: "Processing" })
        });
        if (!res.ok) {
          alert("Failed to update status on backend");
          return;
        }
        loadOrders();
        return;
      } catch (err) {
        alert("Error updating order status");
        return;
      }
    }

    let updatedOrders = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.includes("orders_")) {
        const userOrders =
          JSON.parse(localStorage.getItem(key)) || [];

        const updatedUserOrders = userOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "Processing" }
            : order
        );

        localStorage.setItem(
          key,
          JSON.stringify(updatedUserOrders)
        );

        updatedOrders = [
          ...updatedOrders,
          ...updatedUserOrders,
        ];
      }
    }

    setOrders([...updatedOrders]); // ✅ FIX
  };

  // ✅ FILTERS
  const filteredOrders = orders.filter((o) => {
    const matchSearch = o.id
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      status === "All" || o.status === status;

    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#020617] via-black to-[#020617] text-white">

      {/* ✅ HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl text-yellow-400">Orders</h1>
        <p className="text-gray-400">
          {filteredOrders.length} Orders
        </p>
      </div>

      {/* ✅ FILTER BAR */}
      <div className="flex gap-4 mb-6">

        <input
          placeholder="Search order #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 bg-black border border-white/10 rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-black border border-white/10 p-2 rounded"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>

      </div>

      {/* ✅ TABLE */}
      <div className="border border-white/10 rounded overflow-hidden">

        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="p-3 text-left">ORDER #</th>
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>PAYMENT</th>
              <th>ADDRESS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="text-center border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="text-left p-3">{order.id}</td>

                  <td>{order.items}</td>

                  <td className="text-yellow-400">₹{order.total}</td>

                  {/* ✅ STATUS */}
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="bg-black text-blue-400 border border-white/10 rounded px-2 py-1 text-xs"
                    >
                      <option>Pending</option>
                      <option>Confirmed</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                  <td>
                    <span className="text-green-400">
                      {order.payment}
                    </span>
                  </td>

                  <td className="max-w-[200px] truncate text-gray-400 text-xs">
                    {order.address?.city}, {order.address?.state}
                  </td>

                  <td>{order.date}</td>

                  {/* ✅ ACTIONS */}
                  <td className="flex justify-center gap-2">
                    <button
                      onClick={() => console.log(order)}
                      className="text-blue-400 cursor-pointer"
                    >
                      👁
                    </button>

                    <button
                      onClick={() =>
                        handleQuickUpdate(order.id)
                      }
                      className="text-yellow-400 cursor-pointer"
                    >
                      ✏️
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminOrders;