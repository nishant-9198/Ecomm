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
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-12 flex flex-col justify-between">
      
      <div className="max-w-4xl mx-auto w-full flex-1 mb-16">
        
        {/* ✅ TITLE */}
        <div className="mb-8 text-left">
          <h2 className="text-2xl md:text-3xl font-serif font-light text-white uppercase tracking-wide">
            My Profile
          </h2>
        </div>

        {/* ✅ MAIN CONTAINER */}
        <div className="bg-[#030712] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10 text-left">
          <div className="flex flex-col md:flex-row gap-12 items-start">

            {/* ✅ LEFT: AVATAR SELECTION */}
            <div className="flex flex-col items-center gap-6 w-full md:w-auto">
              
              {/* Current Avatar Container */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-white/15 bg-white/5 p-1 flex-shrink-0">
                <img
                  src={tempUser?.img || "https://via.placeholder.com/100"}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {edit ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">
                    Choose Avatar
                  </p>

                  {/* Preset Grid */}
                  <div className="flex flex-wrap gap-3 justify-center max-w-[240px]">
                    {avatars.map((avatar, index) => (
                      <div
                        key={index}
                        onClick={() => selectAvatar(avatar)}
                        className={`w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-all duration-300 border p-0.5 ${
                          tempUser.img === avatar
                            ? "border-yellow-400 scale-105 shadow-md shadow-yellow-400/10"
                            : "border-white/10 hover:scale-105 hover:border-white/20"
                        }`}
                      >
                        <img
                          src={avatar}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Custom File Upload Button */}
                  <label 
                    htmlFor="avatar-upload" 
                    className="mt-2 text-[9px] tracking-[0.2em] text-white/50 border border-white/10 hover:border-white/30 px-5 py-2.5 rounded-md uppercase font-semibold transition cursor-pointer select-none text-center inline-block"
                  >
                    Choose Custom File
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    onChange={handleImage}
                    className="hidden"
                  />
                </div>
              ) : null}

            </div>

            {/* ✅ RIGHT: DETAILS FORM */}
            <div className="flex-1 w-full space-y-6">

              {edit ? (
                /* EDITING MODE FORM */
                <div className="space-y-6">
                  
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={tempUser.name || ""}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      Email Address
                    </label>
                    <input
                      name="email"
                      value={tempUser.email || ""}
                      onChange={handleChange}
                      placeholder="Your email address"
                      className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition"
                    />
                  </div>

                  {/* Address Textarea */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] tracking-widest text-white/40 uppercase font-light">
                      Delivery Address
                    </label>
                    <textarea
                      name="address"
                      value={tempUser.address || ""}
                      onChange={handleChange}
                      placeholder="Your shipping address"
                      rows={3}
                      className="w-full bg-[#030712] border border-white/10 rounded-md p-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition resize-none"
                    />
                  </div>

                  {/* Edit Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="px-8 py-3.5 bg-[#18181b] text-white hover:bg-white hover:text-black border border-white/20 hover:border-white text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={() => {
                        setTempUser(user || {});
                        setEdit(false);
                      }}
                      className="px-8 py-3.5 bg-transparent text-white border border-white/10 hover:border-white/30 text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>

                </div>
              ) : (
                /* VIEWING MODE DISPLAY */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  
                  {/* Left Column info */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">Full Name</p>
                      <p className="text-sm font-medium text-white mt-1.5">{user?.name || "Not set"}</p>
                    </div>

                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">Email Address</p>
                      <p className="text-sm font-medium text-white mt-1.5">{user?.email || "Not set"}</p>
                    </div>
                  </div>

                  {/* Right Column info */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase font-light">Delivery Address</p>
                      <p className="text-xs leading-relaxed font-light text-white/70 mt-1.5 whitespace-pre-line">
                        {user?.address || "Not available"}
                      </p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="col-span-1 md:col-span-2 pt-6 border-t border-white/5 mt-4">
                    <button
                      onClick={() => setEdit(true)}
                      className="px-8 py-3.5 bg-[#18181b] text-white hover:bg-white hover:text-black border border-white/20 hover:border-white text-[10px] tracking-[0.25em] uppercase font-semibold transition duration-300 cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;