import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const NavBar = () => {
  const { user, setUser, search, setSearch } = useContext(AppContext);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    window.location.href = "/";
  };

  return (
    <nav
      className="
        text-white border-b border-white/10 fixed top-0 left-0 right-0 z-50
        bg-gradient-to-r from-[#020617] via-black to-[#020617] transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 gap-4">

          {/* ✅ LOGO */}
          <Link to="/home" className="flex items-center gap-2 select-none">
            <h1 className="text-base md:text-lg tracking-[0.2em] text-white font-light uppercase transition hover:text-white/80">
              SHOP <span className="font-semibold">EASE</span>
            </h1>
          </Link>

          {/* ✅ SEARCH */}
          <div className="flex-1 max-w-lg hidden sm:flex">
            <div
              className="
                relative w-full bg-white/[0.03] rounded-xl border border-white/10
                transition-all duration-300 ease-out
                group
                hover:border-white/20
                focus-within:border-white/30
                focus-within:bg-white/[0.05]
                hover:scale-[1.01]
                focus-within:scale-[1.01]
              "
            >
              <span
                className="
                  absolute left-3.5 top-1/2 -translate-y-1/2
                  text-white/30 text-xs
                  transition-all duration-300
                  group-hover:text-white/50
                  group-focus-within:text-white/50
                  group-hover:scale-105
                  group-focus-within:scale-105
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2
                  text-white text-xs
                  outline-none rounded-xl
                  bg-transparent
                  placeholder-white/20
                  transition-all duration-300
                "
              />
            </div>
          </div>

          {/* ✅ RIGHT SIDE */}
          <div className="flex items-center gap-5 md:gap-7 text-xs">

            <Link to="/home" className="hidden md:block text-[11px] tracking-[0.2em] uppercase font-semibold text-white/50 hover:text-white transition duration-300">
              Home
            </Link>

            {/* ✅ CART */}
            <Link to="/cart" className="relative text-white/70 hover:text-white transition duration-300 flex items-center justify-center p-1 flex-shrink-0">
              <svg className="w-4.5 h-4.5 transition-transform duration-300 hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {user?.cart?.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md select-none">
                  {user?.cart?.length}
                </span>
              )}
            </Link>

            {/* ✅ USER */}
            {user?.name ? (
              <>
                <Link to="/orders" className="hidden md:block text-[11px] tracking-[0.2em] uppercase font-semibold text-white/50 hover:text-white transition duration-300">
                  Orders
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 hover:border-white/20 transition duration-300 select-none cursor-pointer"
                  >
                    <span className="bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-extrabold select-none">
                      {user.name.charAt(0).toUpperCase()}
                    </span>

                    {/* ✅ UPDATED NAME */}
                    <span className="hidden lg:block text-xs font-medium text-white/90">
                      {user.role === "admin" ? "Admin" : user.name}
                    </span>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-3 w-48 bg-[#09090b] border border-white/10 text-white rounded-xl shadow-2xl overflow-hidden py-1.5 z-50">

                      {/* ✅ PROFILE */}
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setOpen(false);
                        }}
                        className="w-full px-4 py-2.5 hover:bg-white/5 hover:text-white text-left text-xs tracking-wider uppercase font-semibold text-white/70 transition flex items-center gap-2 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </button>

                      {/* ✅ ADMIN PANEL (ONLY ADMIN) */}
                      {user?.role === "admin" && (
                        <button
                          onClick={() => {
                            navigate("/admin");
                            setOpen(false);
                          }}
                          className="w-full px-4 py-2.5 hover:bg-white/5 hover:text-yellow-400 text-left text-xs tracking-wider uppercase font-semibold text-yellow-500/80 transition flex items-center gap-2 border-t border-white/5 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Admin Panel
                        </button>
                      )}

                      {/* ✅ LOGOUT */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 hover:bg-rose-500/10 hover:text-rose-400 text-left text-xs tracking-wider uppercase font-semibold text-rose-500/85 transition flex items-center gap-2 border-t border-white/5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>

                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 border border-white/15 hover:border-white/30 text-[10px] tracking-[0.2em] uppercase font-semibold transition duration-300 rounded-lg bg-white/5 hover:bg-white hover:text-black"
              >
                Login
              </Link>
            )}

          </div>
        </div>

        {/* ✅ MOBILE SEARCH */}
        <div className="pb-3 px-1 sm:hidden">
          <div
            className="
              relative bg-white/[0.03] rounded-xl border border-white/10
              transition-all duration-300 ease-out
              group
              hover:border-white/20
              focus-within:border-white/30
              focus-within:bg-white/[0.05]
            "
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-white text-xs outline-none rounded-xl bg-transparent placeholder-white/20"
            />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;
