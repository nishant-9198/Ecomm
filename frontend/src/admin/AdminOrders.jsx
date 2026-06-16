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
    <div className="space-y-6">

      {/* ✅ HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl tracking-[0.15em] uppercase font-light text-white">
            Manage <span className="font-semibold text-yellow-400">Orders</span>
          </h1>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.2em] font-semibold">
            Order Fulfillment & Logistics
          </p>
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/40">
            {filteredOrders.length} {filteredOrders.length === 1 ? "Order" : "Orders"} Total
          </span>
        </div>
      </div>

      {/* ✅ FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            placeholder="Search orders by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl
              text-white text-xs outline-none transition-all duration-300
              placeholder-white/20 focus:border-yellow-400/30 focus:bg-white/[0.04]
              hover:border-white/20 focus:ring-0
            "
          />
        </div>

        <div className="relative w-full sm:w-56">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="
              w-full pl-4 pr-10 py-3 bg-white/[0.02] border border-white/10 rounded-xl
              text-white text-xs outline-none transition-all duration-300
              focus:border-yellow-400/30 focus:bg-[#030712]
              hover:border-white/20 cursor-pointer appearance-none
            "
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* ✅ TABLE CONTAINER */}
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40 border-b border-white/10 bg-white/[0.01]">
              <tr>
                <th className="p-4 font-semibold w-48">Order ID</th>
                <th className="p-4 font-semibold text-center w-20">Items</th>
                <th className="p-4 font-semibold text-right w-24">Total</th>
                <th className="p-4 font-semibold text-center w-36">Status</th>
                <th className="p-4 font-semibold text-center w-28">Payment</th>
                <th className="p-4 font-semibold">Address</th>
                <th className="p-4 font-semibold w-28">Date</th>
                <th className="p-4 font-semibold text-center w-28">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-white/30 uppercase tracking-wider text-[10px] font-semibold">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/[0.01] transition-colors duration-200"
                  >
                    
                    {/* ✅ ORDER ID */}
                    <td className="p-4 font-semibold text-white/90 font-mono text-xs">
                      {order.id}
                    </td>

                    {/* ✅ ITEMS */}
                    <td className="p-4 text-center text-white/70">
                      {order.items}
                    </td>

                    {/* ✅ TOTAL */}
                    <td className="p-4 text-right font-semibold text-yellow-400 text-sm font-serif">
                      ₹{order.total?.toLocaleString()}
                    </td>

                    {/* ✅ STATUS */}
                    <td className="p-4 text-center">
                      <div className="relative inline-block w-32">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="
                            w-full px-2.5 py-1.5 bg-[#09090b] text-blue-400 border border-white/10 rounded-lg
                            text-xs outline-none transition-all duration-200
                            focus:border-yellow-400/30
                            hover:border-white/20 cursor-pointer text-center
                          "
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* ✅ PAYMENT */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.payment?.toLowerCase() === "paid" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {order.payment}
                      </span>
                    </td>

                    {/* ✅ ADDRESS */}
                    <td className="p-4 text-white/60 max-w-[200px] truncate">
                      {order.address?.city && order.address?.state ? (
                        <>
                          <span className="font-medium text-white/80">{order.address.city}</span>, <span className="text-xs text-white/50">{order.address.state}</span>
                        </>
                      ) : (
                        <span className="text-white/30 italic">No Address</span>
                      )}
                    </td>

                    {/* ✅ DATE */}
                    <td className="p-4 text-white/60">
                      {order.date}
                    </td>

                    {/* ✅ ACTIONS */}
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        {/* ✅ VIEW */}
                        <button
                          onClick={() => console.log(order)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white text-white/70 transition-all duration-300 cursor-pointer"
                          title="Log Order Details"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* ✅ QUICK UPDATE */}
                        <button
                          onClick={() => handleQuickUpdate(order.id)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-yellow-400 text-white/70 transition-all duration-300 cursor-pointer"
                          title="Quick Update to Processing"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;