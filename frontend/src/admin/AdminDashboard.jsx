import { useEffect, useState } from "react";
import { getProducts } from "../utils/getProducts";
import { apiFetch } from "../utils/api";

const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const productData = await getProducts();
      setProducts(productData);

      if (useBackend) {
        try {
          const res = await apiFetch("/api/orders");
          const data = await res.json();
          setOrders(data || []);
          return;
        } catch {
          console.log("Backend failed → using local");
        }
      }

      const localOrders =
        JSON.parse(localStorage.getItem("orders")) || [];

      if (localOrders.length) {
        setOrders(localOrders);
        return;
      }

      setOrders([
        {
          id: "NOIR34947842",
          items: 4,
          total: 4377.8,
          status: "Confirmed",
          payment: "Paid",
          date: "6/15/2026",
        },
      ]);
    };

    fetchData();
  }, []);

  // ✅ CALCULATIONS
  const totalRevenue = orders.reduce(
    (acc, item) => acc + (item.total || 0),
    0
  );

  const categoryCount = {};
  products.forEach((p) => {
    const cat = p.category || "Other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  return (
    <div className="space-y-6">

      {/* ✅ TITLE */}
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl tracking-[0.15em] uppercase font-light text-white">
            Admin <span className="font-semibold text-yellow-400">Dashboard</span>
          </h1>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.2em] font-semibold">
            Real-time Metrics & Insights
          </p>
        </div>
      </div>

      {/* ✅ STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="card flex flex-col justify-between p-5 border border-white/10 bg-black/40 rounded-2xl">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40">Total Products</p>
          <h2 className="text-2xl mt-2 font-light text-white font-serif">{products.length}</h2>
        </div>

        <div className="card flex flex-col justify-between p-5 border border-white/10 bg-black/40 rounded-2xl">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40">Total Orders</p>
          <h2 className="text-2xl mt-2 font-light text-white font-serif">{orders.length}</h2>
        </div>

        <div className="card flex flex-col justify-between p-5 border border-white/10 bg-black/40 rounded-2xl">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40">Total Users</p>
          <h2 className="text-2xl mt-2 font-light text-white font-serif">2</h2>
        </div>

        <div className="card flex flex-col justify-between p-5 border border-white/10 bg-black/40 rounded-2xl">
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40">Total Revenue</p>
          <h2 className="text-2xl mt-2 font-semibold text-yellow-400 font-serif">
            ₹{totalRevenue?.toLocaleString()}
          </h2>
        </div>

      </div>

      {/* ✅ CATEGORY + STATUS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ✅ CATEGORY */}
        <div className="card p-6 border border-white/10 bg-black/40 rounded-2xl">
          <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 border-b border-white/5 pb-3 mb-4">
            Products by Category
          </h3>

          <div className="space-y-3">
            {Object.entries(categoryCount).map(([cat, count]) => (
              <div
                key={cat}
                className="flex justify-between text-xs text-white/70 hover:text-white transition"
              >
                <span className="font-medium">{cat}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/5 text-white/60">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ STATUS */}
        <div className="card p-6 border border-white/10 bg-black/40 rounded-2xl">
          <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 border-b border-white/5 pb-3 mb-4">
            Orders by Status
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between text-xs text-white/70 hover:text-white transition">
              <span className="font-medium">Confirmed</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/5 text-white/60">{orders.length}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ✅ RECENT ORDERS */}
      <div className="card p-6 border border-white/10 bg-black/40 rounded-2xl shadow-xl">

        <h3 className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 border-b border-white/5 pb-3 mb-4">
          Recent Orders
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40 border-b border-white/5 bg-white/[0.01]">
              <tr>
                <th className="p-3 font-semibold">Order ID</th>
                <th className="p-3 font-semibold text-center">Items</th>
                <th className="p-3 font-semibold text-right">Total</th>
                <th className="p-3 font-semibold text-center">Status</th>
                <th className="p-3 font-semibold text-center">Payment</th>
                <th className="p-3 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-white/[0.01] transition-colors duration-200"
                >
                  <td className="p-3 font-semibold text-white/95 font-mono text-xs">{order.id}</td>

                  <td className="p-3 text-center text-white/70">
                    {order.items || order.products?.length}
                  </td>

                  <td className="p-3 text-right font-semibold text-yellow-400 font-serif">₹{order.total?.toLocaleString()}</td>

                  <td className="p-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {order.payment}
                    </span>
                  </td>

                  <td className="p-3 text-white/60">{order.date}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
