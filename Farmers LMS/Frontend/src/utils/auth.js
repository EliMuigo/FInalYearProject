// import { useAuthStore } from "../store/auth";

// import axios from "./axios";

// import jwt_decode from "jwt-decode";
// import Cookies from "js-cookie";
// import Swal from "sweetalert2";

// const ACCESS_TOKEN_KEY = "access_token";
// const REFRESH_TOKEN_KEY = "refresh_token";

// const notify = (title, icon = "success") => {
//   Swal.fire({
//     title,
//     icon,
//     toast: true,
//     position: "top-end",
//     timer: 2000,
//     showConfirmButton: false,
//   });
// };

// export const login = async (username, password) => {
//   try {
//     const { data, status } = await axios.post("user/token/", {
//       email,
//       password,
//     });

//     if (status === 200) {
//       setAuthUser(data.access, data.refresh);
//       alert("Login successful");
//     }
//     return { data, error: null };
//   } catch (error) {
//     return {
//       data: null,
//       error: error.response.data?.detail || "Something went wrong",
//     };
//   }
// };

// export const register = async (full_name, email, password, password2) => {
//   try {
//     const { data } = await axios.post("user/register/", {
//       full_name,
//       email,
//       password,
//       password2,
//     });
//     await login(email, password);
//     alert("Registration successful");
//   } catch (error) {
//     return {
//       data: null,
//       error: error.response.data?.detail || "Something went wrong",
//     };
//   }
// };

// export const logout = () => {
//   Cookies.remove("access_token");
//   Cookies.remove("refresh_token");
//   useAuthStore.getState().setUser(null);
//   alert("Logout successful");
// };

// export const setUser = (user) => {
//   const access_token = Cookie.get("access_token");
//   const refresh_token = Cookie.get("refresh_token");
//   if (!access_token || !refresh_token) {
//     // alert("Token not found");
//     return;
//   }

//   if (isAccessTokenExpired(access_token)) {
//     const response = getRefreshedToken(refresh_token);
//     setAuthUser(response.access, response.refresh);
//   } else {
//     useAuthUser(access_token, refresh_token);
//   }
// };

// export const setAuthUser = (access_token, refresh_token) => {
//   Cookie.set("access_token", access_token, {
//     expires: 1,
//     secure: true,
//   });
//   Cookie.set("refresh_token", refresh_token, {
//     expires: 7,
//     secure: true,
//   });
//   const user = jwt_decode(access_token) ?? null;

//   if (user) {
//     useAuthStore.getState().setUser(user);
//   } else {
//     useAuthStore.getState().setLoading(false);
//   }
// };

// export const getRefreshedToken = async () => {
//   const refresh_token = Cookie.get("refresh_token");
//   const response = await axios.post("user/token/refresh/", {
//     refresh: refresh_token,
//   });
//   return response.data;
// };

// export const isAccessTokenExpired = (access_token) => {
//   try {
//     const decodedToken = jwt_decode(access_token);
//     return decodedToken.exp < Date.now() / 1000;
//   } catch (error) {
//     console.log(error);
//     return true;
//   }
// };
import { useAuthStore } from "../store/auth";
import axios from "./axios";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

// Constants
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Helper function to show notifications
const notify = (title, icon = "success") => {
  Swal.fire({
    title,
    icon,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
  });
};

export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post("user/token/", {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(data.access, data.refresh);
      notify("Login successful");
      return { data, error: null };
    }
  } catch (error) {
    notify(error.response?.data?.detail || "Login failed", "error");
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

export const register = async (full_name, email, password, password2) => {
  try {
    const { data } = await axios.post("user/register/", {
      full_name,
      email,
      password,
      password2,
    });

    if (data) {
      const loginResult = await login(email, password);
      if (!loginResult.error) {
        notify("Registration successful");
        return { data, error: null };
      }
    }
  } catch (error) {
    notify(error.response?.data?.detail || "Registration failed", "error");
    return {
      data: null,
      error: error.response?.data?.detail || "Something went wrong",
    };
  }
};

export const logout = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  useAuthStore.getState().setUser(null);
  notify("Logout successful");
};

export const setUser = async () => {
  try {
    const access_token = Cookies.get(ACCESS_TOKEN_KEY);
    const refresh_token = Cookies.get(REFRESH_TOKEN_KEY);

    if (!access_token || !refresh_token) {
      useAuthStore.getState().setLoading(false);
      return;
    }

    if (isAccessTokenExpired(access_token)) {
      try {
        const response = await getRefreshedToken(refresh_token);
        if (response?.access && response?.refresh) {
          setAuthUser(response.access, response.refresh);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    } else {
      setAuthUser(access_token, refresh_token);
    }
  } catch (error) {
    console.error("Error in setUser:", error);
    logout();
  }
};

export const setAuthUser = (access_token, refresh_token) => {
  try {
    Cookies.set(ACCESS_TOKEN_KEY, access_token, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });

    Cookies.set(REFRESH_TOKEN_KEY, refresh_token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    const user = jwt_decode(access_token);

    if (user) {
      useAuthStore.getState().setUser(user);
    }
  } catch (error) {
    console.error("Error in setAuthUser:", error);
    useAuthStore.getState().setLoading(false);
  }
};

export const getRefreshedToken = async (refresh_token) => {
  try {
    const response = await axios.post("user/token/refresh/", {
      refresh: refresh_token,
    });
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const isAccessTokenExpired = (access_token) => {
  try {
    const decodedToken = jwt_decode(access_token);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

// Setup axios interceptors for automatic token handling
axios.interceptors.request.use(
  (config) => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = Cookies.get(REFRESH_TOKEN_KEY);
        if (!refresh_token) throw new Error("No refresh token");

        const response = await getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);

        originalRequest.headers.Authorization = `Bearer ${response.access}`;
        return axios(originalRequest);
      } catch (error) {
        logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
