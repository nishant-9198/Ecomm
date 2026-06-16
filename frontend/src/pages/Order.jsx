import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Orders = () => {
  const { user } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      const useBackend =
        import.meta.env.VITE_USE_BACKEND === "true";
      const API_URL = import.meta.env.VITE_API_URL;

      // ✅ BACKEND
      if (useBackend) {
        try {
          const res = await fetch(`${API_URL}/api/orders`);
          const data = await res.json();
          setOrders(data);
          return;
        } catch {
          console.log("Backend failed → local");
        }
      }

      // ✅ ✅ FINAL FIX (USER SPECIFIC)
      const userKey = `orders_${user?.id}`;

      const localOrders =
        JSON.parse(localStorage.getItem(userKey)) || [];

      setOrders(localOrders);
    };

    loadOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10">

      <h2 className="text-2xl md:text-3xl mb-8">
        Your Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">

          {orders.map((order, index) => {
            const total = order.total || 0;
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl transition hover:border-gray-600"
              >

                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="w-full flex justify-between items-center p-4"
                >
                  <div className="text-left">
                    <p className="text-xs text-gray-400">
                      {order.date}
                    </p>
                    <p className="font-medium">
                      Order #{index + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-medium text-yellow-400">
                      ₹{total}
                    </span>

                    <span
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                    >
                      ⌄
                    </span>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[600px] p-4" : "max-h-0"
                    }`}
                >

                  <div className="space-y-4">
                    {(order.products || []).map((item) => (
                      <div key={item.id} className="flex items-center gap-4">


                        <div className="w-14 h-14 bg-gray-800 flex items-center justify-center overflow-hidden rounded">
                          {typeof item.img === "string" ? (
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            item.img
                          )}
                        </div>
                        ``


                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="text-yellow-400">
                          ₹
                          {Number(item.price) *
                            Number(item.quantity)}
                        </p>

                      </div>
                    ))}
                  </div>

                  <hr className="my-4 border-gray-700" />

                  <div className="text-sm text-gray-400">
                    <p className="font-medium text-white mb-1">
                      Delivery Address
                    </p>

                    <p>
                      {order.address?.name},{" "}
                      {order.address?.house},{" "}
                      {order.address?.address1},{" "}
                      {order.address?.city},{" "}
                      {order.address?.state},{" "}
                      {order.address?.country}
                    </p>
                  </div>

                  <div className="flex justify-between mt-4 font-medium text-lg">
                    <span>Total</span>
                    <span className="text-yellow-400">
                      ₹{order.total}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default Orders;