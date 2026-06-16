import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const cart = user?.cart || [];

  const increaseQty = (id) => {
    setUser((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));
  };

  const decreaseQty = (id) => {
    setUser((prev) => ({
      ...prev,
      cart: prev.cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));
  };

  const removeItem = (id) => {
    setUser((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== id),
    }));
    toast("Item removed from bag");
  };

  const placeOrder = () => {
    if (!user?.name) {
      toast("Please login first");
      return;
    }

    if (cart.length === 0) {
      toast("Your bag is empty");
      return;
    }

    navigate("/checkout");
  };

  // ✅ PRICING CALCULATIONS
  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-12 flex flex-col justify-between">
      
      <div className="max-w-[1250px] mx-auto w-full flex-1 mb-16">
        
        {cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center justify-center">
            <span className="text-[10px] tracking-[0.25em] font-sans font-light text-white/40 uppercase block mb-1">
              0 Items
            </span>
            <h2 className="text-3xl font-serif font-light text-white mb-6 uppercase tracking-wide">
              Your Bag
            </h2>
            <p className="text-white/40 text-sm font-light mb-8 max-w-xs leading-relaxed">
              Discover timeless products and add them to your collection.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="px-8 py-3 bg-white text-black text-xs tracking-[0.2em] uppercase font-medium border border-white hover:bg-transparent hover:text-white transition duration-300 cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start mt-6">

            {/* LEFT COLUMN: ITEMS LIST */}
            <div className="flex-1 w-full">
              {/* Header */}
              <div className="mb-8 text-left">
                <span className="text-[10px] tracking-[0.25em] font-sans font-light text-white/40 uppercase block">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-light text-white mt-1.5 uppercase tracking-wide">
                  Your Bag
                </h2>
              </div>

              {/* Items */}
              <div className="border-t border-white/10">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 sm:gap-6 py-6 border-b border-white/10 relative text-left"
                  >
                    
                    {/* IMAGE */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="max-h-full object-contain"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        {/* Brand */}
                        <p className="text-[9px] tracking-[0.2em] font-sans font-light text-white/40 uppercase mb-0.5">
                          {item.brand || "NOIR ATELIER"}
                        </p>
                        {/* Title */}
                        <h3 className="text-xs sm:text-sm font-light text-white leading-tight">
                          {item.name}
                        </h3>
                        {/* Variations */}
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-[10px] text-white/40 font-light mt-1.5 capitalize tracking-wider">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && "   •   "}
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/10 rounded bg-white/5 overflow-hidden w-20 mt-3 sm:mt-1">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="px-2 py-1 text-white/50 hover:text-white hover:bg-white/5 transition flex-1 flex justify-center cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center text-[11px] font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(item.id)}
                          className="px-2 py-1 text-white/50 hover:text-white hover:bg-white/5 transition flex-1 flex justify-center cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>

                    {/* PRICE AND REMOVE */}
                    <div className="flex flex-col justify-between items-end flex-shrink-0 text-right">
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/30 hover:text-white transition cursor-pointer p-0.5"
                        aria-label="Remove item"
                      >
                        <X size={14} />
                      </button>

                      {/* Item Total */}
                      <div>
                        <div className="text-xs sm:text-sm font-light text-white font-serif">
                          ₹{(Number(item.price) * item.quantity).toLocaleString()}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[9px] text-white/40 font-light mt-0.5">
                            ₹{Number(item.price).toLocaleString()} each
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY */}
            <div className="w-full lg:w-[350px] bg-[#030712] border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10 text-left">
              
              <h3 className="text-xs font-semibold tracking-[0.2em] text-white/90 uppercase mb-6">
                Order Summary
              </h3>

              {/* Promo input */}
              <div className="relative flex border border-white/10 rounded-md bg-white/5 mb-6 overflow-hidden focus-within:border-white/30 transition">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  className="w-full bg-transparent px-3 py-2 text-[10px] text-white uppercase placeholder-white/25 focus:outline-none"
                />
                <button className="bg-white/10 hover:bg-white/20 text-white text-[9px] tracking-widest uppercase px-4 py-2 border-l border-white/10 transition cursor-pointer">
                  Apply
                </button>
              </div>

              {/* Summary details */}
              <div className="space-y-4 text-xs font-light text-white/50 mb-6 border-b border-white/10 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="text-white font-medium">₹{gst.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-medium text-white uppercase tracking-wider">Total</span>
                <span className="text-lg font-serif text-white">₹{grandTotal.toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={placeOrder}
                  className="w-full bg-white hover:bg-transparent text-black hover:text-white py-3 border border-white text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer block"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="w-full text-center text-[9px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition duration-200 cursor-pointer block py-1.5"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Razorpay Trust Logo */}
              <div className="border-t border-white/10 mt-8 pt-6 text-center">
                <p className="text-[8px] tracking-[0.25em] uppercase text-white/25 mb-3.5 font-light">
                  Secured by
                </p>
                <div className="flex justify-center items-center gap-4 text-[9px] tracking-widest uppercase font-semibold text-white/30">
                  <span>Razorpay</span>
                  <span>•</span>
                  <span>UPI</span>
                  <span>•</span>
                  <span>Cards</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Cart;
