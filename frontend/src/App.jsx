import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Login } from "./pages/Login";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Orders from "./pages/Order";
import Profile from "./pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Checkout from "./pages/CheckOut";
import LandingPage from "./pages/LandingPage";


import AdminLayout from "./admin/AdminLayout";
import AdminRoute from "./admin/AdminRoute.jsx";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminUsers from "./admin/AdminUsers";


//  Layout
function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" || location.pathname === "/login";

  const isLanding = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <NavBar />}

      {isLanding ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      ) : (
        <div className={`bg-gray-100 min-h-screen ${!hideNavbar ? "pt-[116px] sm:pt-[72px]" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Routes>

              <Route path="/login" element={<Login />} />

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

             
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />


              </Route>

            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

// ✅ APP
function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
