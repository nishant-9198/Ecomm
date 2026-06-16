import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Login = () => {
  const inputRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(AppContext);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSendOTP = () => {
    if (mobile.length !== 10) {
      toast.error("Enter valid mobile number");
      return;
    }

    setShowOTP(true);
    toast.success("OTP sent ✅");
  };

  const handleVerifyOTP = () => {
    if (otp !== "000000") {
      toast.error("Invalid OTP ❌");
      return;
    }

    // ✅ ADMIN CHECK (UNCHANGED)
    const isAdmin = mobile === "9198004022";

    // ✅ ✅ FINAL FIX: ADD USER ID (VERY IMPORTANT)
    const user = {
      id: mobile,   // ✅ UNIQUE USER ID (FIXES ORDER ISSUE)
      mobile,
      name: isAdmin ? "Admin" : "User",
      role: isAdmin ? "admin" : "user",
    };

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login Successful ✅");
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex bg-black text-white">

      {/* ✅ LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <h1 className="text-4xl tracking-widest font-light">
          Shop <span className="text-gray-500">Ease</span>
        </h1>
      </div>

      {/* ✅ RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6">

        <div className="w-full max-w-md">

          <h2 className="text-2xl font-light mb-8">
            Sign In
          </h2>

          {/* ✅ MOBILE */}
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Mobile Number
          </label>

          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            ref={inputRef}
            placeholder="Enter mobile number"
            className="
              w-full mt-2 mb-6
              bg-transparent border border-gray-700
              px-4 py-3 text-sm
              outline-none
              focus:border-white
              transition
            "
          />

          {/* ✅ SEND OTP */}
          {!showOTP && (
            <button
              onClick={handleSendOTP}
              className="
                w-full py-3
                border border-gray-600
                text-sm tracking-wide
                hover:bg-white hover:text-black
                transition duration-300
              "
            >
              SEND OTP →
            </button>
          )}

          {/* ✅ OTP */}
          {showOTP && (
            <>
              <label className="text-xs text-gray-400 uppercase tracking-wide">
                Enter OTP
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerifyOTP();
                }}
                className="
                  w-full mt-2 mb-6
                  bg-transparent border border-gray-700
                  px-4 py-3 text-sm
                  outline-none
                  focus:border-white
                  transition
                "
              />

              <button
                onClick={handleVerifyOTP}
                className="
                  w-full py-3
                  bg-white text-black
                  text-sm tracking-wide
                  hover:opacity-80
                  transition
                "
              >
                VERIFY →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
