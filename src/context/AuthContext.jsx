import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Fallback added so app still works even if .env is missing
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://task-manager-backend-qdhh.onrender.com";

const API_URL = `${BASE_URL}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await fetchProfile();
      } else {
        delete axios.defaults.headers.common["Authorization"];
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`);
      setUser(res.data);
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      setToken(data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // If backend already returns user data with token
      if (data.user) {
        setUser(data.user);
      } else {
        await fetchProfile();
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
      });

      const data = res.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      }

      if (data.user) {
        setUser(data.user);
      } else {
        await fetchProfile();
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);