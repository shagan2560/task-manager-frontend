import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL + "/api/auth";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Set axios header and load profile
  useEffect(() => {

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfile();
    } 
    else {
      setLoading(false);
    }

  }, [token]);


  // Get logged in user
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


  // LOGIN
  const login = async (email, password) => {

    try {

      const res = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const { token: newToken, ...userData } = res.data;

      localStorage.setItem("token", newToken);

      setToken(newToken);
      setUser(userData);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return res.data;

    } catch (error) {

      throw new Error(
        error.response?.data?.message || "Login failed"
      );

    }

  };


  // REGISTER
  const register = async (name, email, password) => {

    try {

      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password
      });

      const { token: newToken, ...userData } = res.data;

      localStorage.setItem("token", newToken);

      setToken(newToken);
      setUser(userData);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return res.data;

    } catch (error) {

      throw new Error(
        error.response?.data?.message || "Register failed"
      );

    }

  };


  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);
    setUser(null);

    delete axios.defaults.headers.common["Authorization"];

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () => useContext(AuthContext);