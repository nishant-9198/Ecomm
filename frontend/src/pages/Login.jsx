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
  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSendOTP = async () => {
    if (mobile.length !== 10) {
      toast.error("Enter valid mobile number");
      return;
    }

    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    const API_URL = import.meta.env.VITE_API_URL;
    let exists = false;

    if (useBackend) {
      try {
        const res = await fetch(`${API_URL}/api/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile })
        });
        if (!res.ok) {
          toast.error("Failed to send OTP");
          return;
        }
        const data = await res.json();
        exists = data.isExistingUser || false;
      } catch (err) {
        toast.error("Error connecting to backend");
        return;
      }
    } else {
      const localUsers = JSON.parse(localStorage.getItem("users")) || [];
      exists = localUsers.some(u => u.mobile === mobile) || mobile === "9198004022";
    }

    setIsExistingUser(exists);
    setShowOTP(true);
    toast.success("OTP sent ✅");
  };

  const handleVerifyOTP = async () => {
    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    const API_URL = import.meta.env.VITE_API_URL;

    if (useBackend) {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, otp })
        });

        if (!res.ok) {
          toast.error("Invalid OTP ❌");
          return;
        }

        const data = await res.json();
        const user = {
          id: data.user.id,
          mobile: data.user.mobile,
          name: data.user.name,
          role: data.user.role,
          email: data.user.email,
          address: data.user.address,
          img: data.user.img,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        };

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login Successful ✅");
        navigate("/home");
        return;
      } catch (err) {
        toast.error("Error connecting to backend");
        return;
      }
    }

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

          <h2 className="text-2xl font-light mb-8 tracking-widest">
            {!showOTP ? (
              <>
                Shop <span className="text-gray-500">Ease</span>
              </>
            ) : isExistingUser ? (
              "Login"
            ) : (
              "Sign Up"
            )}
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
