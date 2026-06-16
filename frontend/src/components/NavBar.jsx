import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const NavBar = () => {
  const { user, setUser, search, setSearch } = useContext(AppContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/home", { replace: true });
  };

  return (
    <nav
      className="
        text-white shadow-md z-50

        /* ✅ LANDING THEME */
        bg-gradient-to-r from-[#020617] via-black to-[#020617]
      "
    >

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

        <div className="flex items-center justify-between py-2 gap-3">

          {/* ✅ LOGO */}
          <Link to="/home">
            <h1 className="text-lg md:text-2xl font-bold text-yellow-400">
              ShopEase
            </h1>
          </Link>

          {/* ✅ SEARCH */}
          <div className="flex-1 max-w-3xl hidden sm:flex">
            <div
              className="
                relative w-full bg-white rounded-lg border border-gray-300
                transition-all duration-300 ease-out
                group
                hover:shadow-lg hover:shadow-yellow-400/20
                hover:border-yellow-400
                focus-within:border-yellow-400
                focus-within:ring-2 focus-within:ring-yellow-400/40
                focus-within:shadow-lg focus-within:shadow-yellow-400/30
                hover:scale-[1.01]
                focus-within:scale-[1.01]
              "
            >
              <span
                className="
                  absolute left-3 top-1/2 -translate-y-1/2
                  text-gray-500 text-sm
                  transition-all duration-300
                  group-hover:text-yellow-500
                  group-focus-within:text-yellow-500
                  group-hover:scale-110
                  group-focus-within:scale-110
                "
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2.5
                  text-black text-sm
                  outline-none rounded-lg
                  bg-transparent
                  placeholder-gray-400
                  transition-all duration-300
                "
              />
            </div>
          </div>

          {/* ✅ RIGHT SIDE */}
          <div className="flex items-center gap-4 md:gap-6 text-sm">

            <Link to="/home" className="hidden md:block hover:text-yellow-400">
              Home
            </Link>

            {/* ✅ CART */}
            <Link to="/cart" className="relative hover:text-yellow-400 text-lg">
              🛒
              <span className="absolute -top-2 -right-3 bg-red-500 text-[10px] px-2 py-[1px] rounded-full font-bold">
                {user?.cart?.length || 0}
              </span>
            </Link>

            {/* ✅ USER */}
            {user?.name ? (
              <>
                <Link to="/orders" className="hidden md:block hover:text-yellow-400">
                  Orders
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-700 transition"
                  >
                    <span className="bg-yellow-400 text-black rounded-full px-2 py-1 text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>

                    {/* ✅ UPDATED NAME */}
                    <span className="hidden lg:block">
                      {user.role === "admin" ? "Admin" : user.name}
                    </span>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded-md shadow-lg overflow-hidden">

                      {/* ✅ PROFILE */}
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setOpen(false);
                        }}
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left text-sm"
                      >
                        Profile
                      </button>

                      {/* ✅ ADMIN PANEL (ONLY ADMIN) */}
                      {user?.role === "admin" && (
                        <button
                          onClick={() => {
                            navigate("/admin");
                            setOpen(false);
                          }}
                          className="w-full px-4 py-2 hover:bg-gray-100 text-left text-sm text-yellow-500 font-medium"
                        >
                          Admin Panel
                        </button>
                      )}

                      {/* ✅ LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 hover:bg-gray-100 text-left text-red-500 text-sm"
                      >
                        Logout
                      </button>

                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-400 text-black px-3 md:px-4 py-1 rounded-md hover:bg-yellow-500"
              >
                Login
              </Link>
            )}

          </div>
        </div>

        {/* ✅ MOBILE SEARCH */}
        <div className="pb-2 sm:hidden">
          <div
            className="
              relative bg-white rounded-md border border-gray-300
              transition-all duration-300
              group
              hover:border-yellow-400
              focus-within:border-yellow-400
              focus-within:ring-2 focus-within:ring-yellow-400/40
            "
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-black text-sm outline-none rounded-md bg-transparent"
            />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
