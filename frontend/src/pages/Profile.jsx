import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { apiFetch } from "../utils/api";

const avatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
];

const Profile = () => {
  const { user, setUser } = useContext(AppContext);

  const [edit, setEdit] = useState(false);
  const [tempUser, setTempUser] = useState(user || {});

  useEffect(() => {
    const loadProfile = async () => {
      const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
      if (useBackend && user) {
        try {
          const res = await apiFetch("/api/users/profile");
          if (res.ok) {
            const data = await res.json();
            const merged = { ...user, ...data };
            setUser(merged);
            setTempUser(merged);
            localStorage.setItem("user", JSON.stringify(merged));
          }
        } catch (err) {
          console.log("Failed to load profile from backend");
        }
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setTempUser({
      ...tempUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempUser({
        ...tempUser,
        img: URL.createObjectURL(file),
      });
    }
  };

  const selectAvatar = (avatar) => {
    setTempUser({
      ...tempUser,
      img: avatar,
    });
  };

  const handleSave = async () => {
    const useBackend = import.meta.env.VITE_USE_BACKEND === "true";
    if (useBackend) {
      try {
        const res = await apiFetch("/api/users/profile", {
          method: "PUT",
          body: JSON.stringify(tempUser)
        });
        if (res.ok) {
          const data = await res.json();
          const merged = { ...user, ...data };
          setUser(merged);
          localStorage.setItem("user", JSON.stringify(merged));
          setEdit(false);
          return;
        } else {
          alert("Failed to save profile on backend");
          return;
        }
      } catch (err) {
        alert("Error saving profile");
        return;
      }
    }

    setUser(tempUser);
    setEdit(false);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10">

      {/* ✅ TITLE */}
      <h2 className="text-2xl md:text-3xl font-light mb-8 tracking-wide">
        My Profile
      </h2>

      {/* ✅ MAIN CONTAINER */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 md:p-8 shadow-lg">

        <div className="flex flex-col md:flex-row gap-8">

          {/* ✅ LEFT: AVATAR */}
          <div className="flex flex-col items-center gap-4">

            <img
              src={tempUser?.img || "https://via.placeholder.com/100"}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-600"
            />

            {/* ✅ AVATAR SELECT */}
            {edit && (
              <>
                <p className="text-sm text-gray-400">Choose Avatar</p>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">

                  {avatars.map((avatar, index) => (
                    <div
                      key={index}
                      onClick={() => selectAvatar(avatar)}
                      className={`
                        w-16 h-16 sm:w-20 sm:h-20
                        rounded-full overflow-hidden cursor-pointer
                        transition-all duration-300
                        ${
                          tempUser.img === avatar
                            ? "ring-2 ring-yellow-400 scale-110"
                            : "hover:scale-110 hover:ring-1 hover:ring-gray-500"
                        }
                      `}
                    >
                      <img
                        src={avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                </div>

                {/* ✅ UPLOAD */}
                <input
                  type="file"
                  onChange={handleImage}
                  className="text-xs text-gray-400 mt-2"
                />
              </>
            )}

          </div>

          {/* ✅ RIGHT: DETAILS */}
          <div className="flex-1 space-y-5">

            {/* NAME */}
            <div>
              <p className="text-gray-400 text-sm">Full Name</p>
              {edit ? (
                <input
                  name="name"
                  value={tempUser.name || ""}
                  onChange={handleChange}
                  className="w-full mt-1 bg-transparent border border-gray-600 px-3 py-2 rounded focus:outline-none focus:border-yellow-400"
                />
              ) : (
                <p className="mt-1">{user?.name || "Not set"}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              {edit ? (
                <input
                  name="email"
                  value={tempUser.email || ""}
                  onChange={handleChange}
                  className="w-full mt-1 bg-transparent border border-gray-600 px-3 py-2 rounded focus:outline-none focus:border-yellow-400"
                />
              ) : (
                <p className="mt-1">{user?.email || "Not set"}</p>
              )}
            </div>

            {/* ADDRESS */}
            <div>
              <p className="text-gray-400 text-sm">Address</p>
              {edit ? (
                <textarea
                  name="address"
                  value={tempUser.address || ""}
                  onChange={handleChange}
                  className="w-full mt-1 bg-transparent border border-gray-600 px-3 py-2 rounded focus:outline-none focus:border-yellow-400"
                />
              ) : (
                <p className="mt-1">{user?.address || "Not available"}</p>
              )}
            </div>

            {/* ✅ BUTTONS */}
            <div className="flex gap-3 pt-2">

              {edit ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-yellow-400 text-black px-5 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEdit(false)}
                    className="bg-gray-700 px-5 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEdit(true)}
                  className="bg-white text-black px-5 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  Edit Profile
                </button>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;