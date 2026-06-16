import { useContext } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const AdminLayout = () => {
  const { user } = useContext(AppContext);
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex min-h-screen text-white bg-[#020205]">

      {/* ✅ PREMIUM SIDEBAR */}
      <aside className="w-64 bg-[#09090b] border-r border-white/5 flex flex-col justify-between p-6 shrink-0">
        
        <div>
          {/* ✅ SIDEBAR BRAND LOGO */}
          <Link to="/home" className="flex items-center gap-2 select-none border-b border-white/5 pb-6 mb-8 block hover:opacity-95 transition">
            <h1 className="text-sm tracking-[0.22em] text-white font-light uppercase">
              SHOP <span className="font-semibold text-yellow-400">EASE</span>
              <span className="block text-[8px] tracking-[0.3em] text-white/35 font-semibold mt-1.5">Admin Workspace</span>
            </h1>
          </Link>

          {/* ✅ NAVIGATION MENU */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 group cursor-pointer
                    ${isActive 
                      ? "bg-gradient-to-r from-yellow-400/10 to-transparent border-l-2 border-yellow-400 text-yellow-400 shadow-[inset_1px_0_0_rgba(250,204,21,0.05)]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02] hover:translate-x-1"
                    }
                  `}
                >
                  <span className={`transition-colors duration-300 ${isActive ? "text-yellow-400" : "text-white/30 group-hover:text-white/70"}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ✅ SIDEBAR FOOTER */}
        <div className="border-t border-white/5 pt-5 mt-auto flex flex-col gap-4">
          
          {/* Active Admin Details */}
          {user?.name && (
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center font-bold text-yellow-400 text-xs select-none">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/95 truncate">{user.name}</p>
                <p className="text-[9px] tracking-wider text-white/35 uppercase font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  Authorized Admin
                </p>
              </div>
            </div>
          )}

          {/* Quick return button */}
          <Link
            to="/home"
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20
              text-[10px] tracking-widest text-white/60 hover:text-white uppercase font-bold transition-all duration-300
              bg-white/[0.01] hover:bg-white/5 cursor-pointer
            "
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Store
          </Link>
        </div>

      </aside>

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet />  {/* ✅ Dynamic page content render */}
      </main>

    </div>
  );
};

export default AdminLayout;