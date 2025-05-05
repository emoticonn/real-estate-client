import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/LoginModal.css";

const LoginModal = ({ onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://localhost:7252/api/auth/login", { username, password });

      const { token, role, profile, userId } = res.data;
      if (token && role && profile && userId) {
        login(token, role, username, userId);  // Тепер напряму передаємо userId з відповіді
        const backTo = location.state?.from?.pathname || "/";
        navigate(backTo, { replace: true });
        onClose();
      } else {
        setError("Невірний логін або пароль");
      }
    } catch {
      setError("Невірний логін або пароль");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2>Авторизація</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ім'я користувача"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit">Увійти</button>
          {error && <p className="error">{error}</p>}
        </form>
        <button onClick={onClose} className="close-button">Закрити</button>
      </div>
    </div>
  );
};

export default LoginModal;
