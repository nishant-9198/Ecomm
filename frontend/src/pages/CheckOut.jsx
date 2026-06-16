import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const Checkout = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const cart = user?.cart || [];

  const [form, setForm] = useState({
    name: user?.name || "",
    house: "",
    address1: "",
    city: "",
    state: "",
    country: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = cart.reduce(
    (acc, item) =>
      acc + Number(item.price) * Number(item.quantity),
    0
  );

  const roundedTotal = Math.round(total);

  const handleCheckout = () => {
    const { name, house, address1, city, state, country } = form;

    if (!name || !house || !address1 || !city || !state || !country) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const options = {
      key: "rzp_test_T0fj0KQyTHNu8h",
      amount: roundedTotal * 100,
      currency: "INR",
      name: "Shop Ease",
      description: "Test Transaction",
      image: "/logo.png",

      // ✅ ✅ FINAL UPDATED HANDLER
      handler: async function (response) {
        const orderItems = cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          img: item.img,
          quantity: item.quantity,
        }));

        const newOrder = {
          id: "ORD" + Date.now(),
          products: orderItems,
          items: cart.length,
          total: roundedTotal,
          address: form,
          paymentId: response.razorpay_payment_id,
          status: "Confirmed",
          payment: "Paid",
          date: new Date().toLocaleDateString(),
        };

        const useBackend =
          import.meta.env.VITE_USE_BACKEND === "true";

        // ✅ BACKEND MODE
        if (useBackend) {
          try {
            await apiFetch("/api/orders", {
              method: "POST",
              body: JSON.stringify(newOrder),
            });
          } catch {
            console.log("Backend failed → fallback local");
          }
        }

        // ✅ ✅ USER-SPECIFIC STORAGE (FIX)
        const userKey = `orders_${user.id}`;

        const existingOrders =
          JSON.parse(localStorage.getItem(userKey)) || [];

        const updatedOrders = [...existingOrders, newOrder];

        localStorage.setItem(userKey, JSON.stringify(updatedOrders));

        // ✅ UPDATE USER CONTEXT
        setUser((prev) => ({
          ...prev,
          orders: [...(prev.orders || []), newOrder],
          cart: [],
        }));

        alert("✅ Payment Successful!");
        navigate("/orders");
      },

      prefill: {
        name: name,
        email: "test@example.com",
        contact: "9999999999",
      },

      theme: {
        color: "#FACC15",
      },
    };

    // ✅ SAFETY CHECK
    if (!window.Razorpay) {
      alert("Razorpay not loaded. Please refresh.");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function () {
      alert("❌ Payment Failed");
    });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      <h2 className="text-2xl mb-8">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ✅ LEFT */}
        <div className="flex-1 space-y-6">

          {cart.map((item) => (
            <div
              key={item.id}
              className="
                flex gap-4 bg-white/5 p-3 rounded
                transition duration-300
                hover:shadow-[0_0_15px_rgba(250,204,21,0.25)]
              "
            >
              <div className="
                relative w-16 h-16
                bg-gray-800 rounded-md
                flex items-center justify-center
                overflow-hidden group
                hover:shadow-[0_0_15px_3px_rgba(250,204,21,0.6)]
              ">
                <img
                  src={item.img}
                  alt={item.name}
                  className="max-h-full object-contain"
                />
              </div>

              <div className="flex-1">
                <p>{item.name}</p>
                <p className="text-gray-400">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="text-yellow-400">
                ₹{Math.round(item.price * item.quantity)}
              </p>
            </div>
          ))}

          {/* ✅ ADDRESS */}
          <div className="bg-white/5 p-5 rounded space-y-4">

            <h3 className="text-lg">Delivery Details</h3>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name"
              className="w-full p-2 rounded bg-gray-900 border border-gray-600" />

            <div className="flex gap-3">
              <input name="house" value={form.house} onChange={handleChange}
                placeholder="House No."
                className="w-1/2 p-2 bg-gray-900 border border-gray-600" />

              <input name="address1" value={form.address1} onChange={handleChange}
                placeholder="Address"
                className="w-1/2 p-2 bg-gray-900 border border-gray-600" />
            </div>

            <div className="flex gap-3">
              <input name="city" value={form.city} onChange={handleChange}
                className="w-1/3 p-2 bg-gray-900 border border-gray-600" />

              <input name="state" value={form.state} onChange={handleChange}
                className="w-1/3 p-2 bg-gray-900 border border-gray-600" />

              <input name="country" value={form.country} onChange={handleChange}
                className="w-1/3 p-2 bg-gray-900 border border-gray-600" />
            </div>

          </div>
        </div>

        {/* ✅ RIGHT */}
        <div className="w-80 bg-white/5 p-6 rounded-xl border border-white/10">

          <h3>Order Summary</h3>

          <p>Items ({cart.length})</p>
          <p>Total: ₹{roundedTotal}</p>

          <button
            onClick={handleCheckout}
            className="
              w-full mt-4 bg-yellow-400 text-black py-2 rounded-md font-semibold
              hover:bg-yellow-500
              hover:shadow-[0_0_18px_rgba(250,204,21,0.6)]
            "
          >
            Confirm Order
          </button>

        </div>
      </div>
    </div>
  );
};

export default Checkout;