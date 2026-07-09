import { jwtDecode } from "jwt-decode";
import api from "../../../config/api";

const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.success && response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.data.user));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getToken = () => {
  return localStorage.getItem("token");
};

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const decodeToken = (token) => {
  try {
    if (!token) return null;
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};

export default {
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  decodeToken,
};
