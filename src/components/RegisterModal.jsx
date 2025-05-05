import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginModal.css";

const RegisterModal = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataUpload = new FormData();
      Object.keys(formData).forEach(key => {
        formDataUpload.append(key, formData[key]);
      });

      if (photoFile) {
        formDataUpload.append("file", photoFile);
      }

      await axios.post("https://localhost:7252/api/auth/register", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" }
      });

     
      const loginRes = await axios.post("https://localhost:7252/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      const { token, role, profile } = loginRes.data;
      if (token && role && profile) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userIdFromToken = parseInt(payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

        login(token, role, formData.username, userIdFromToken);
        const backTo = location.state?.from?.pathname || "/";
        navigate(backTo, { replace: true });
        onClose();
      }
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError("Помилка реєстрації. Ім'я користувача зайняте або сервер недоступний.");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2>Реєстрація клієнта</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Ім'я користувача" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
          <input type="text" name="firstName" placeholder="Ім'я" value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Прізвище" value={formData.lastName} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          <button type="submit">Зареєструватися</button>
          {error && <p className="error">{error}</p>}
        </form>
        <button onClick={onClose} className="close-button">Закрити</button>
      </div>
    </div>
  );
};

export default RegisterModal;
