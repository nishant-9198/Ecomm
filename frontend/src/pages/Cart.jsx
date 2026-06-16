import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

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

  const total = cart.reduce(
    (acc, item) =>
      acc + Number(item.price) * Number(item.quantity),
    0
  );

  // ✅ FIX: ONLY NAVIGATE (DO NOT CLEAR CART)
  const placeOrder = () => {
    if (!user?.name) {
      alert("Please login first");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    navigate("/checkout"); // ✅ IMPORTANT FIX
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h2 className="text-2xl mb-8">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-400">Cart is empty</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white/5 p-4 rounded flex gap-4">

                {/* ✅ IMAGE */}
               
          <div
  className="
    relative w-20 h-20
    bg-gray-800 rounded-lg
    flex items-center justify-center
    overflow-hidden
    group
    transition duration-300

    /* ✅ OUTWARD GLOW */
    hover:shadow-[0_0_20px_4px_rgba(250,204,21,0.6)]
  "
>
  {/* ✅ IMAGE */}
  <img
    src={item.img}
    alt={item.name}
    className="
      h-full w-full
      object-contain
      transition duration-300
      group-hover:scale-105
    "
  />

  {/* ✅ LIGHT GLOW OVERLAY */}
  <div
    className="
      absolute inset-0
      bg-gradient-to-t from-yellow-400/15 to-transparent
      opacity-0
      group-hover:opacity-100
      transition duration-300
    "
  />
</div>


                <div className="flex-1">
                  <h3>{item.name}</h3>
                  <p className="text-gray-400">₹{item.price}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => decreaseQty(item.id)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>

              </div>
            ))}
          </div>

          <div className="w-80 bg-white/5 p-6 rounded">
            <h3 className="mb-4">Summary</h3>

            <div className="flex justify-between">
              <span>Total</span>
              <span className="text-yellow-400">₹{total}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full mt-4 bg-yellow-400 text-black py-2 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
