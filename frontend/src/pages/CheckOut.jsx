import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { toast } from "sonner";

const Checkout = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const cart = user?.cart || [];

  const [form, setForm] = useState({
    name: user?.name || "",
    house: "", // Maps to Address Line 2
    address1: "", // Maps to Address Line 1
    city: "",
    state: "",
    country: "", // Maps to Pincode
  });

  const [contactInfo, setContactInfo] = useState({
    email: user?.email || "",
    phone: user?.mobile || "",
  });

  // ✅ STEP TRACKER: 1 = Address, 2 = Delivery, 3 = Payment
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard"); // "standard" or "express"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  // ✅ PRICING CALCULATIONS
  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );
  const gst = Math.round(subtotal * 0.18);
  const shippingCost = shippingMethod === "express" ? 599 : 0;
  const grandTotal = subtotal + gst + shippingCost;
  const roundedTotal = Math.round(grandTotal);

  const handleContinueToDelivery = () => {
    const { name, house, address1, city, state, country } = form;
    const { email, phone } = contactInfo;

    if (!name || !house || !address1 || !city || !state || !country) {
      toast("Please fill all shipping details");
      return;
    }

    if (!email || !phone) {
      toast("Please fill email and phone details");
      return;
    }

    setCheckoutStep(2);
  };

  const handleCheckout = () => {
    const { name, house, address1, city, state, country } = form;
    const { email, phone } = contactInfo;

    if (!name || !house || !address1 || !city || !state || !country) {
      toast("Please fill all shipping details");
      return;
    }

    if (!email || !phone) {
      toast("Please fill email and phone details");
      return;
    }

    if (cart.length === 0) {
      toast("Your cart is empty");
      return;
    }

    const options = {
      key: "rzp_test_T0fj0KQyTHNu8h",
      amount: roundedTotal * 100,
      currency: "INR",
      name: "Shop Ease",
      description: "Test Transaction",
      image: "/logo.png",

      handler: async function (response) {
        const orderItems = cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          img: item.img,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
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

        const useBackend = import.meta.env.VITE_USE_BACKEND === "true";

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

        const userKey = `orders_${user.id}`;
        const existingOrders = JSON.parse(localStorage.getItem(userKey)) || [];
        const updatedOrders = [...existingOrders, newOrder];

        localStorage.setItem(userKey, JSON.stringify(updatedOrders));

        setUser((prev) => ({
          ...prev,
          orders: [...(prev.orders || []), newOrder],
          cart: [],
        }));

        toast("Payment Successful!");
        navigate("/orders");
      },

      prefill: {
        name: name,
        email: email,
        contact: phone,
      },

      theme: {
        color: "#FACC15",
      },
    };

    if (!window.Razorpay) {
      toast("Razorpay not loaded. Please refresh.");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function () {
      toast("Payment Failed");
    });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-12 flex flex-col justify-between">
      
      <div className="max-w-[1250px] mx-auto w-full flex-1 mb-16">
        
        {/* ✅ PROGRESS STEPS */}
        <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] font-sans font-light uppercase mb-12 select-none text-left">
          {/* Step 1: Address */}
          <div className="flex items-center gap-2">
            {checkoutStep > 1 ? (
              <>
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[9px] font-bold">✓</span>
                <span className="text-emerald-500 font-medium">Address</span>
              </>
            ) : (
              <>
                <span className="w-5 h-5 rounded-full border border-white text-white flex items-center justify-center text-[9px] font-semibold">1</span>
                <span className="text-white font-medium">Address</span>
              </>
            )}
          </div>
          
          <span className="text-white/20">&gt;</span>
          
          {/* Step 2: Delivery */}
          <div className="flex items-center gap-2">
            {checkoutStep > 2 ? (
              <>
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[9px] font-bold">✓</span>
                <span className="text-emerald-500 font-medium">Delivery</span>
              </>
            ) : checkoutStep === 2 ? (
              <>
                <span className="w-5 h-5 rounded-full bg-[#18181b] border border-white/20 text-white flex items-center justify-center text-[9px] font-semibold">2</span>
                <span className="text-white font-semibold">Delivery</span>
              </>
            ) : (
              <>
                <span className="w-5 h-5 rounded-full border border-white/10 text-white/30 flex items-center justify-center text-[9px]">2</span>
                <span className="text-white/30">Delivery</span>
              </>
            )}
          </div>
          
          <span className="text-white/20">&gt;</span>
          
          {/* Step 3: Payment */}
          <div className="flex items-center gap-2">
            {checkoutStep === 3 ? (
              <>
                <span className="w-5 h-5 rounded-full bg-[#18181b] border border-white/20 text-white flex items-center justify-center text-[9px] font-semibold">3</span>
                <span className="text-white font-semibold">Payment</span>
              </>
            ) : (
              <>
                <span className="w-5 h-5 rounded-full border border-white/10 text-white/20 flex items-center justify-center text-[9px]">3</span>
                <span className="text-white/20">Payment</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start mt-6">

          {/* LEFT: DELIVERY FORM DETAILS */}
          <div className="flex-1 w-full space-y-6">
            
            {/* STEP 1: SHIPPING ADDRESS */}
            {checkoutStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold tracking-[0.2em] text-white/80 uppercase mb-4 font-serif text-left">
                  Shipping Address
                </h3>

                {/* FULL NAME */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                  />
                </div>

                {/* EMAIL & PHONE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={handleContactChange}
                      placeholder="your@email.com"
                      className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={contactInfo.phone}
                      onChange={handleContactChange}
                      placeholder="10-digit number"
                      className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>
                </div>

                {/* ADDRESS LINE 1 */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                    Address Line 1
                  </label>
                  <input
                    name="address1"
                    value={form.address1}
                    onChange={handleChange}
                    placeholder="House/Flat, Street"
                    className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                  />
                </div>

                {/* ADDRESS LINE 2 (HOUSE NO / LANDMARK) */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    name="house"
                    value={form.house}
                    onChange={handleChange}
                    placeholder="Area, Landmark"
                    className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                  />
                </div>

                {/* CITY & STATE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      City
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      State
                    </label>
                    <div className="relative w-full">
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white focus:outline-none focus:border-white/30 appearance-none transition"
                      >
                        <option value="" disabled>Select state</option>
                        {[
                          "Delhi",
                          "Maharashtra",
                          "Karnataka",
                          "Uttar Pradesh",
                          "Haryana",
                          "Tamil Nadu",
                          "Gujarat",
                          "Telangana",
                          "West Bengal"
                        ].map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-[9px]">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* PINCODE (COUNTRY MAP) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      Pincode
                    </label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>
                </div>

                {/* PROCEED ACTION */}
                <div className="pt-4 text-left">
                  <button
                    onClick={handleContinueToDelivery}
                    className="px-8 py-3.5 bg-[#18181b] text-white hover:bg-white hover:text-black border border-white/10 hover:border-white text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer"
                  >
                    CONTINUE TO DELIVERY &gt;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {checkoutStep === 2 && (
              <div className="space-y-6 text-left">
                <h3 className="text-sm font-semibold tracking-[0.2em] text-white/80 uppercase mb-6 font-serif">
                  Delivery Method
                </h3>
                
                <div className="space-y-4">
                  {/* Standard option */}
                  <div
                    onClick={() => setShippingMethod("standard")}
                    className={`flex justify-between items-center p-6 border rounded-xl cursor-pointer transition duration-300 ${
                      shippingMethod === "standard"
                        ? "border-white/20 bg-white/5"
                        : "border-white/10 bg-transparent hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition duration-300 ${
                        shippingMethod === "standard" ? "border-white" : "border-white/25"
                      }`}>
                        {shippingMethod === "standard" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">Standard Delivery</p>
                        <p className="text-xs text-white/40 font-light mt-0.5">3-5 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-serif text-white">Free</span>
                  </div>

                  {/* Express option */}
                  <div
                    onClick={() => setShippingMethod("express")}
                    className={`flex justify-between items-center p-6 border rounded-xl cursor-pointer transition duration-300 ${
                      shippingMethod === "express"
                        ? "border-white/20 bg-white/5"
                        : "border-white/10 bg-transparent hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition duration-300 ${
                        shippingMethod === "express" ? "border-white" : "border-white/25"
                      }`}>
                        {shippingMethod === "express" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">Express Delivery</p>
                        <p className="text-xs text-white/40 font-light mt-0.5">1-2 business days</p>
                      </div>
                    </div>
                    <span className="text-sm font-serif text-white">₹599</span>
                  </div>
                </div>

                {/* Back / Continue Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="px-8 py-3.5 bg-transparent text-white border border-white/10 hover:border-white/30 text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer"
                  >
                    BACK
                  </button>
                  <button
                    onClick={() => setCheckoutStep(3)}
                    className="px-8 py-3.5 bg-[#18181b] text-white hover:bg-white hover:text-black border border-white/20 hover:border-white text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer"
                  >
                    CONTINUE TO PAYMENT &gt;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {checkoutStep === 3 && (
              <div className="space-y-6 text-left">
                <h3 className="text-sm font-semibold tracking-[0.2em] text-white/80 uppercase mb-6 font-serif">
                  Payment
                </h3>
                
                {/* Razorpay Option Container */}
                <div className="border border-white/15 rounded-xl bg-[#030712] p-6 mb-8 relative">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg select-none">
                        R
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white tracking-wide">Razorpay Secure Checkout</p>
                        <p className="text-[10px] text-white/45 font-light mt-0.5">SSL encrypted payment</p>
                      </div>
                    </div>
                    <div className="text-white/40">
                      🔒
                    </div>
                  </div>

                  <p className="text-[11px] text-white/40 font-light text-center mb-8">
                    You will be redirected to Razorpay's secure payment gateway
                  </p>

                  {/* Payment Methods Grid */}
                  <div className="grid grid-cols-3 gap-y-4 gap-x-2 text-[10px] tracking-wider text-white/30 font-medium border-t border-white/5 pt-6 text-center select-none">
                    <div>UPI</div>
                    <div className="border-l border-r border-white/5">Net Banking</div>
                    <div>Cards</div>
                    <div className="border-t border-white/5 pt-4">Wallets</div>
                    <div className="border-t border-l border-r border-white/5 pt-4">EMI</div>
                    <div className="border-t border-white/5 pt-4">Pay Later</div>
                  </div>
                </div>

                {/* Delivering To Box */}
                <div className="border border-white/10 rounded-xl bg-white/5 p-6 mb-8 text-left">
                  <h4 className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3.5 font-light">
                    DELIVERING TO
                  </h4>
                  <p className="text-xs font-medium text-white">{form.name}</p>
                  <p className="text-xs text-white/50 leading-relaxed font-light mt-1 max-w-sm">
                    {form.house}
                    {form.house && <br />}
                    {form.address1}, {form.state} — {form.country}
                  </p>
                  <p className="text-xs text-white/50 font-light mt-2">{contactInfo.phone}</p>
                </div>

                {/* Back / Pay Buttons */}
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => setCheckoutStep(2)}
                    className="px-8 py-3.5 bg-transparent text-white border border-white/10 hover:border-white/30 text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 py-3.5 bg-[#18181b] text-white hover:bg-white hover:text-black border border-white/20 hover:border-white text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer flex justify-center items-center gap-2"
                  >
                    <span>PAY ₹{grandTotal.toLocaleString()}</span>
                    <span>🔒</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: ORDER SUMMARY SIDEBAR */}
          <div className="w-full lg:w-[380px] bg-[#030712] border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10 text-left">
            
            <h3 className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase mb-6">
              Order Summary
            </h3>

            {/* Cart Items list */}
            <div className="max-h-[200px] overflow-y-auto space-y-4 mb-6 border-b border-white/10 pb-6 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  
                  {/* Thumbnail with Qty Badge */}
                  <div className="relative w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center overflow-hidden p-0.5 flex-shrink-0">
                    <img src={item.img} alt={item.name} className="max-h-full object-contain" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#0ea5e9] text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg select-none">
                      {item.quantity}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-medium text-white/95 truncate">
                      {item.name}
                    </h4>
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-[9px] text-white/40 font-light mt-0.5 capitalize truncate">
                        {item.selectedSize || "One Size"} • {item.selectedColor || "Default"}
                      </p>
                    )}
                    <p className="text-[11px] font-serif text-white/90 mt-1">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-4 text-xs font-light text-white/50 mb-6 border-b border-white/10 pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-serif">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white font-serif">
                  {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="text-white font-serif">₹{gst.toLocaleString()}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-white uppercase tracking-wider">Total</span>
              <span className="text-lg font-serif text-white">₹{grandTotal.toLocaleString()}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;