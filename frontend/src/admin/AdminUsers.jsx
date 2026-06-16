import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ LOAD USERS FROM API / LOCAL STORAGE
  const loadUsers = async () => {
    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    if (useBackend) {
      try {
        const res = await apiFetch("/api/users");
        const data = await res.json();
        const formatted = (data || []).map(u => ({
          ...u,
          joined: new Date().toLocaleDateString()
        }));
        setUsers(formatted);
        return;
      } catch (err) {
        console.log("Backend failed to load users");
      }
    }

    let allUsers = [];

    // ✅ CURRENT USER
    const current =
      JSON.parse(localStorage.getItem("user")) || null;

    if (current) {
      allUsers.push({
        ...current,
        email: `${current.mobile}@shopEase.com`, // ✅ fake email
        joined: new Date().toLocaleDateString(),
      });
    }

    setUsers(allUsers);
  };

  // ✅ FILTERS
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchRole = role === "All" || u.role === role;

    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#020617] via-black to-[#020617] text-white">

      {/* ✅ HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl text-yellow-400">Users</h1>
      </div>

      {/* ✅ FILTER BAR */}
      <div className="flex gap-4 mb-6">

        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 bg-black border border-white/10 rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-black border border-white/10 p-2 rounded"
        >
          <option>All</option>
          <option>admin</option>
          <option>user</option>
        </select>

      </div>

      {/* ✅ TABLE */}
      <div className="border border-white/10 rounded-xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="p-3 text-left">USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>JOINED</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >

                  {/* ✅ USER */}
                  <td className="p-3 flex items-center gap-3">

                    {/* ✅ AVATAR */}
                    <div className="
                      w-8 h-8 rounded-full
                      bg-gray-800 flex items-center justify-center
                      text-sm
                    ">
                      {u.name?.[0]?.toUpperCase()}
                    </div>

                    {u.name}
                  </td>

                  {/* ✅ EMAIL */}
                  <td className="text-gray-400 text-sm">
                    {u.email}
                  </td>

                  {/* ✅ ROLE */}
                  <td>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${u.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-gray-500/20 text-gray-300"}
                    `}>
                      {u.role}
                    </span>
                  </td>

                  {/* ✅ JOINED */}
                  <td className="text-gray-400">
                    {u.joined}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
