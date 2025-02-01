import { useAuthStore } from "../store/auth";

import axios from "./axios";

import jwt_decode from "just-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

export const login = async (username, password) => {
  try {
    const { data, status } = await axios.post("user/token/", {
      email,
      password,
    });

    if (status === 200) {
      setAuthUser(data.access, data.refresh);
      alert("Login successful");
    }
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Something went wrong",
    };
  }
};

export const register = async (username, email, password) => {
  try {
    const { data } = await axios.post("user/register/", {
      full_name,
      email,
      password,
      password2,
    });
    await login(email, password);
    alert("Registration successful");
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Something went wrong",
    };
  }
};

export const logout = () => {
  Cookie.remove("access_token");
  Cookie.remove("refresh_token");
  useAuthStore.getState().setUser(null);
  alert("Logout successful");
};

export const setUser = (user) => {
  const access_token = Cookie.get("access_token");
  const refresh_token = Cookie.get("refresh_token");
  if (!access_token || !refresh_token) {
    alert("Token not found");
    return;
  }

  if (isAccessTokenExpired(access_token)) {
    const response = getRefreshedToken(refresh_token);
    setAuthUser(response.access, response.refresh);
  } else {
    useAuthUser(access_token, refresh_token);
  }
};

export const setAuthUser = (access_token, refresh_token) => {
  Cookie.set("access_token", access_token);

  // Cookie.set("refresh_token", refresh_token);
  // const user = jwt_decode(access_token);
  // useAuthStore.getState().setUser(user);
};
