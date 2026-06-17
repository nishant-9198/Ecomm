import { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Pagination from "../components/ui/Pagination";

const getEstimatedDelivery = (dateStr) => {
  try {
    if (!dateStr) return "3-5 business days";
    const parts = dateStr.split("/");
    let d;
    if (parts.length === 3) {
      const p0 = parseInt(parts[0], 10);
      const p1 = parseInt(parts[1], 10);
      const p2 = parseInt(parts[2], 10);
      if (p0 > 12) {
        d = new Date(p2, p1 - 1, p0);
      } else {
        d = new Date(p2, p0 - 1, p1);
        if (isNaN(d.getTime())) {
          d = new Date(p2, p1 - 1, p0);
        }
      }
    } else {
      d = new Date(dateStr);
    }

    if (isNaN(d.getTime())) {
      return "3-5 business days";
    }
    
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'long' });
  } catch {
    return "3-5 business days";
  }
};

const Orders = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

      // Always load local orders as the base
      const userKey = `orders_${user?.id}`;
      const localOrders = JSON.parse(localStorage.getItem(userKey)) || [];

      let backendOrders = [];
      if (useBackend) {
        try {
          const res = await apiFetch("/api/orders");
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              backendOrders = data;
            }
          }
        } catch {
          console.log("Backend failed to load orders in Order.jsx");
        }
      }

      // Merge backend and local orders, prioritizing backend orders if IDs overlap
      const mergedOrders = [...backendOrders];
      localOrders.forEach((localOrder) => {
        if (localOrder && localOrder.id && !mergedOrders.some((o) => o.id === localOrder.id)) {
          mergedOrders.push(localOrder);
        }
      });

      setOrders(mergedOrders);
    };

    loadOrders();
  }, [user]);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(orders.length / pageSize);

  const currentOrders = useMemo(() => {
    return orders.slice((page - 1) * pageSize, page * pageSize);
  }, [orders, page]);

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10">

      <h2 className="text-2xl md:text-3xl font-serif font-light text-white uppercase tracking-wide mb-8">
        Your Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">No orders yet</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">

          {currentOrders.map((order, relativeIndex) => {
            const absoluteIndex = (page - 1) * pageSize + relativeIndex;
            const total = order.total || 0;
            const isOpen = openIndex === absoluteIndex;
            const statuses = ["Confirmed", "Processing", "Shipped", "Delivered"];
            const currentStatusRaw = order.status || "Confirmed";
            const normalizedStatus = currentStatusRaw.charAt(0).toUpperCase() + currentStatusRaw.slice(1).toLowerCase();
            const currentStatusIndex = Math.max(0, statuses.indexOf(normalizedStatus));

            return (
              <div
                key={order.id || absoluteIndex}
                className="bg-[#030712] border border-white/10 rounded-xl transition hover:border-white/20 overflow-hidden"
              >

                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : absoluteIndex)
                  }
                  className="w-full flex justify-between items-center p-5 select-none hover:bg-white/[0.02] transition"
                >
                  <div className="text-left">
                    <p className="text-[10px] text-white/40 tracking-wider">
                      {order.date}
                    </p>
                    <p className="text-sm font-serif font-light text-white mt-1">
                      Order #{absoluteIndex + 1}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-serif text-yellow-400 text-sm">
                      ₹{total.toLocaleString()}
                    </span>

                    <span
                      className={`transition-transform duration-300 text-white/40 text-xs ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-700 ${
                    isOpen ? "max-h-[2000px] p-6 border-t border-white/5 bg-white/[0.01]" : "max-h-0"
                  }`}
                >
                  {/* PREMIUM DETAIL BOX */}
                  <div className="border border-white/10 rounded-2xl bg-[#09090b] p-6 mb-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-left">
                      {/* Order Number */}
                      <div>
                        <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">Order Number</p>
                        <p className="text-xs font-serif font-medium text-white mt-1.5 tracking-wide">{order.id || `ORD${Date.now()}`}</p>
                      </div>
                      
                      {/* Order Total */}
                      <div>
                        <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">Order Total</p>
                        <p className="text-xs font-serif font-medium text-white mt-1.5">₹{total.toLocaleString()}</p>
                      </div>

                      {/* Estimated Delivery */}
                      <div>
                        <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">Estimated Delivery</p>
                        <p className="text-xs text-white/80 font-medium mt-1.5">{getEstimatedDelivery(order.date)}</p>
                      </div>

                      {/* Payment */}
                      <div>
                        <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">Payment</p>
                        <p className="text-xs text-emerald-400 font-medium mt-1.5">Confirmed via Razorpay</p>
                      </div>
                    </div>

                    <hr className="border-white/5 my-6" />

                    {/* ORDER STATUS STEP PROGRESS */}
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light mb-6">Order Status</p>
                      
                      {/* Horizontal Step Line */}
                      <div className="relative flex justify-between items-center w-full px-2">
                        {/* Connecting Lines */}
                        <div className="absolute left-6 right-6 top-[18px] h-[2px] bg-white/10 -z-10">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ 
                              width: `${
                                currentStatusIndex === 0 ? "0%" :
                                currentStatusIndex === 1 ? "33%" :
                                currentStatusIndex === 2 ? "66%" : "100%"
                              }`
                            }}
                          />
                        </div>

                        {/* Steps */}
                        {statuses.map((statusName, idx) => {
                          const isCompleted = idx <= currentStatusIndex;
                          
                          return (
                            <div key={idx} className="flex flex-col items-center flex-1 text-center">
                              {/* Step circle */}
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition duration-300 ${
                                isCompleted 
                                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" 
                                  : "bg-[#18181b] border border-white/10 text-white/30"
                              }`}>
                                {idx === 0 ? (
                                  /* Checkmark for Confirmed */
                                  <svg className="w-4 h-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : idx === 1 ? (
                                  /* Box Package for Processing */
                                  isCompleted ? (
                                    <svg className="w-4.5 h-4.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                  )
                                ) : idx === 2 ? (
                                  /* Truck for Shipped */
                                  isCompleted ? (
                                    <svg className="w-4.5 h-4.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m10-1h3m-3 0a2 2 0 014 0h1.5a1.5 1.5 0 001.5-1.5V11.5a1.5 1.5 0 00-1.5-1.5H16.5a1.5 1.5 0 00-1.5 1.5V16" />
                                    </svg>
                                  )
                                ) : (
                                  /* Home for Delivered */
                                  isCompleted ? (
                                    <svg className="w-4.5 h-4.5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                  )
                                )}
                              </div>
                              {/* Step Text */}
                              <span className={`text-[8px] md:text-[9px] tracking-wider font-semibold uppercase mt-3.5 ${
                                isCompleted ? "text-white" : "text-white/20"
                              }`}>
                                {statusName === "Confirmed" ? "ORDER CONFIRMED" : statusName === "Processing" ? "PROCESSING" : statusName === "Shipped" ? "SHIPPED" : "DELIVERED"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ORDERED ITEMS */}
                  <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4 font-light text-left">
                    Ordered Items
                  </h4>

                  <div className="space-y-4">
                    {(order.products || []).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 text-left">
                        <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden rounded-lg p-0.5">
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

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {item.name}
                          </p>
                          {(item.selectedSize || item.selectedColor) && (
                            <p className="text-[9px] text-white/40 font-light mt-0.5 capitalize truncate">
                              {item.selectedSize || "One Size"} • {item.selectedColor || "Default"}
                            </p>
                          )}
                          <p className="text-[9px] text-white/40 font-light mt-0.5">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <p className="font-serif text-yellow-400 text-sm">
                          ₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr className="my-6 border-white/5" />

                  {/* DELIVERY ADDRESS */}
                  <div className="text-sm text-white/50 text-left mb-6">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3 font-light">
                      Delivery Address
                    </p>

                    <p className="text-xs leading-relaxed font-light text-white/70">
                      <span className="font-medium text-white">{order.address?.name}</span>
                      {order.address?.house && <br />}
                      {order.address?.house}
                      <br />
                      {order.address?.address1}, {order.address?.city}, {order.address?.state} — {order.address?.country}
                    </p>
                  </div>

                  {/* TOTAL AMOUNT PAID */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-light text-left">Total Amount Paid</span>
                    <span className="text-lg font-serif text-white">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8 justify-center">
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white text-[10px] tracking-[0.2em] uppercase font-semibold transition duration-300 cursor-pointer flex items-center gap-2 rounded-lg"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      CONTINUE SHOPPING
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-transparent text-white border border-white/15 hover:border-white/30 text-[10px] tracking-[0.2em] uppercase font-semibold transition duration-300 cursor-pointer flex items-center gap-2 rounded-lg"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      BACK TO HOME
                    </button>
                  </div>

                  {/* Brand Quote */}
                  <p className="font-serif italic text-[11px] text-white/25 mt-6 tracking-wide text-center">
                    "Every package is a promise kept."
                  </p>
                </div>
              </div>
            );
          })}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            hasNextPage={page < totalPages}
            hasPreviousPage={page > 1}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;