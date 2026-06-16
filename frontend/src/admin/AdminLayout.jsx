import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-[#020617] via-black to-[#020617]">

      {/* ✅ SIDEBAR */}
      <div className="w-64 p-6 border-r border-white/10">

        <h2 className="text-xl text-yellow-400 mb-10 tracking-widest">
          ShopEase
        </h2>

        <div className="flex flex-col gap-4 text-sm">

          <Link to="/admin" className="hover:text-yellow-400 transition">
            Dashboard
          </Link>

          <Link to="/admin/products" className="hover:text-yellow-400 transition">
            Products
          </Link>

          {/* <Link className="hover:text-yellow-400 transition">
            Orders
          </Link> */}
          <Link to="/admin/orders" className="hover:text-yellow-400 transition">Orders</Link>

          
          <Link to="/admin/users" className="hover:text-yellow-400 transition">Users</Link>

        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 p-8">

        <Outlet />  {/* ✅ Dynamic content here */}

      </div>

    </div>
  );
};

export default AdminLayout;