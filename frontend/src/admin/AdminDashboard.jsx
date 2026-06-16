import { useEffect, useState } from "react";
import { getProducts } from "../utils/getProducts";

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
          const res = await fetch(`${API_URL}/api/orders`);
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
    <div
      className="
        min-h-screen p-6 space-y-8
        bg-gradient-to-br from-[#020617] via-black to-[#020617]
      "
    >

      {/* ✅ TITLE */}
      <h1 className="text-2xl font-semibold tracking-wide text-yellow-400">
        Dashboard
      </h1>

      {/* ✅ STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="card">
          <p className="label">TOTAL PRODUCTS</p>
          <h2 className="text-xl mt-1">{products.length}</h2>
        </div>

        <div className="card">
          <p className="label">TOTAL ORDERS</p>
          <h2 className="text-xl mt-1">{orders.length}</h2>
        </div>

        <div className="card">
          <p className="label">TOTAL USERS</p>
          <h2 className="text-xl mt-1">2</h2>
        </div>

        <div className="card">
          <p className="label">TOTAL REVENUE</p>
          <h2 className="text-xl mt-1 text-yellow-400">
            ₹{totalRevenue}
          </h2>
        </div>

      </div>

      {/* ✅ CATEGORY + STATUS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ✅ CATEGORY */}
        <div className="card">
          <h3 className="mb-4 text-gray-300">
            Products by Category
          </h3>

          {Object.entries(categoryCount).map(([cat, count]) => (
            <div
              key={cat}
              className="flex justify-between text-sm text-gray-400 mb-2"
            >
              <span>{cat}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>

        {/* ✅ STATUS */}
        <div className="card">
          <h3 className="mb-4 text-gray-300">
            Orders by Status
          </h3>

          <div className="flex justify-between text-sm text-gray-400">
            <span>Confirmed</span>
            <span>{orders.length}</span>
          </div>
        </div>

      </div>

      {/* ✅ RECENT ORDERS */}
      <div className="card backdrop-blur-md">

        <h3 className="mb-4 text-gray-300">
          Recent Orders
        </h3>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b border-white/10">
            <tr>
              <th className="text-left py-2">ORDER #</th>
              <th>ITEMS</th>
              <th>TOTAL</th>
              <th>STATUS</th>
              <th>PAYMENT</th>
              <th>DATE</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="
                  text-center text-gray-300
                  transition duration-300
                  hover:bg-white/5
                "
              >
                <td className="text-left py-3">{order.id}</td>

                <td>
                  {order.items || order.products?.length}
                </td>

                <td>₹{order.total}</td>

                <td>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                    {order.status}
                  </span>
                </td>

                <td>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                    {order.payment}
                  </span>
                </td>

                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminDashboard;
