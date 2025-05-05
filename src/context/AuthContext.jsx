import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUsername = localStorage.getItem("username");
    const savedUserId = localStorage.getItem("userId");

    if (savedToken && savedRole && savedUsername && savedUserId) {
      setToken(savedToken);
      setRole(savedRole);
      setUsername(savedUsername);
      setUserId(parseInt(savedUserId));
    } else if (window.location.pathname !== "/" && window.location.pathname !== "/register") {
      navigate("/");
    }
  }, [navigate]);

  const login = (token, role, username, userId) => {
    if (token && role && username && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId.toString());

      setToken(token);
      setRole(role);
      setUsername(username);
      setUserId(userId);

      navigate("/");
    } else {
      console.error("Invalid data during login.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setToken(null);
    setRole(null);
    setUsername(null);
    setUserId(null);

    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, role, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
