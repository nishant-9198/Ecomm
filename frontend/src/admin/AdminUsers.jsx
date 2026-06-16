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
    <div className="space-y-6">

      {/* ✅ HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl tracking-[0.15em] uppercase font-light text-white">
            Manage <span className="font-semibold text-yellow-400">Users</span>
          </h1>
          <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.2em] font-semibold">
            User Accounts & Permission Controls
          </p>
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-white/40">
            {filteredUsers.length} {filteredUsers.length === 1 ? "User" : "Users"} Total
          </span>
        </div>
      </div>

      {/* ✅ FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl
              text-white text-xs outline-none transition-all duration-300
              placeholder-white/20 focus:border-yellow-400/30 focus:bg-white/[0.04]
              hover:border-white/20 focus:ring-0
            "
          />
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="
              w-full pl-4 pr-10 py-3 bg-white/[0.02] border border-white/10 rounded-xl
              text-white text-xs outline-none transition-all duration-300
              focus:border-yellow-400/30 focus:bg-[#030712]
              hover:border-white/20 cursor-pointer appearance-none
            "
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin Only</option>
            <option value="user">User Only</option>
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* ✅ TABLE CONTAINER */}
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/40 border-b border-white/10 bg-white/[0.01]">
              <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Email Address</th>
                <th className="p-4 font-semibold text-center w-36">Role</th>
                <th className="p-4 font-semibold text-center w-36">Joined</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-white/30 uppercase tracking-wider text-[10px] font-semibold">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/[0.01] transition-colors duration-200"
                  >
                    {/* ✅ USER DETAILS */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center font-bold text-yellow-400 text-xs select-none">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-semibold text-white/90 text-sm">
                        {u.name}
                      </span>
                    </td>

                    {/* ✅ EMAIL */}
                    <td className="p-4 text-white/60 text-xs">
                      {u.email || <span className="text-white/20 italic">No Email Address</span>}
                    </td>

                    {/* ✅ ROLE BADGE */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                          : "bg-white/5 text-white/60 border border-white/15"
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    {/* ✅ JOINED DATE */}
                    <td className="p-4 text-center text-white/50 text-xs">
                      {u.joined}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
