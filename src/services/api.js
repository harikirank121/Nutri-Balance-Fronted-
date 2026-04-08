import axios from "axios";

// ✅ CUSTOM AXIOS INSTANCE
const API = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// ✅ ADD REQUEST INTERCEPTOR (Inject JWT Token)
API.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ ADD RESPONSE INTERCEPTOR (Global error handling)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.warn("Session expired or unauthorized. Logging out...");
                localStorage.removeItem('user');
                window.location.href = "/login?expired=true";
            }
            // Return a structured error message from backend if available
            const message = error.response.data?.error || Object.values(error.response.data)[0] || "API Error";
            return Promise.reject({ ...error, message });
        }
        return Promise.reject({ ...error, message: "Network error or server unreachable" });
    }
);

export default API;