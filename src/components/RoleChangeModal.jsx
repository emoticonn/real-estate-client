import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/RoleChangeModal.css";

const RoleChangeModal = ({ user, onClose, onRoleUpdated }) => {
  const { token } = useAuth();
  const [role, setRole] = useState(user.role);
  const [workCity, setWorkCity] = useState(""); // Стан для міста роботи
  const roles = ["client", "agent", "accountant", "admin_user"];

  const handleSubmit = async () => {
    try {
      await axios.put(`https://localhost:7252/api/user/${user.userID}/changerole`, 
        { newRole: role, workCity: role === "agent" ? workCity : null }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Роль успішно оновлена!");
      onRoleUpdated();
      onClose();
    } catch (error) {
      console.error("Помилка зміни ролі:", error.response?.data || error.message);
      alert("Не вдалося оновити роль. Перевірте правильність даних або спробуйте ще раз.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Ви впевнені, що хочете видалити користувача ${user.username}?`)) {
      return;
    }

    try {
      await axios.delete(`https://localhost:7252/api/user/${user.userID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Користувача успішно видалено!");
      onRoleUpdated();
      onClose();
    } catch (error) {
      console.error("Помилка видалення користувача:", error.response?.data || error.message);
      alert("Не вдалося видалити користувача.");
    }
  };

  return (
    <div className="role-modal-overlay">
      <div className="role-modal">
        <button className="role-close-button" onClick={onClose}>×</button>
        <h3>Зміна ролі для {user.username} ({user.firstName} {user.lastName})</h3>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {role === "agent" && (
          <input 
            type="text" 
            placeholder="Місто роботи агента" 
            value={workCity} 
            onChange={(e) => setWorkCity(e.target.value)}
            required
          />
        )}

        <button className="submit-button" onClick={handleSubmit}>Оновити роль</button>
        <button className="delete-button" onClick={handleDelete}>Видалити користувача</button>
      </div>
    </div>
  );
};

export default RoleChangeModal;
