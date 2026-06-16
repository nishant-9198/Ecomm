import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    password: "",
    Address: "",
    cart: [],
    orders: [],
  });

  const [search, setSearch] = useState(""); // ✅ ADD THIS

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    if (user?.name) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, search, setSearch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;