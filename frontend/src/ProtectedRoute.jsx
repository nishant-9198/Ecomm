import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);

  if (!user?.name) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;