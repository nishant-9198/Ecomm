const API_URL = import.meta.env.VITE_API_URL;

export const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return {
      "Authorization": `Bearer ${user.accessToken}`
    };
  }
  return {};
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Setup headers
  const authHeaders = getAuthHeaders();
  
  // Determine if it is a JSON body or multipart form data
  const isMultipart = options.body instanceof FormData;
  
  const defaultHeaders = isMultipart 
    ? { ...authHeaders }
    : {
        "Content-Type": "application/json",
        ...authHeaders
      };

  options.headers = {
    ...defaultHeaders,
    ...options.headers
  };

  let res = await fetch(url, options);

  // Handle Token Refresh on 401 Unauthorized
  if (res.status === 401) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
          })
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          
          // Update user in local storage
          const updatedUser = {
            ...user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          
          // Retry the original request with the new access token
          options.headers["Authorization"] = `Bearer ${data.accessToken}`;
          res = await fetch(url, options);
        } else {
          // Token expired or invalid -> logout
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  }

  return res;
};
