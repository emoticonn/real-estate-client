import { useState } from "react";
import "../styles/EditAgentModal.css";
import { useAuth } from "../context/AuthContext";

const EditAgentModal = ({ agent, onClose, onSave }) => {
  const { role } = useAuth();

  const [formData, setFormData] = useState({ ...agent });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="agent-modal-overlay">
      <div className="agent-modal">
        <h3>Редагування агента</h3>

        <label>Імʼя:</label>
        <input name="firstName" value={formData.firstName} onChange={handleChange} />

        <label>Прізвище:</label>
        <input name="lastName" value={formData.lastName} onChange={handleChange} />

        <label>Телефон:</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />

        <label>Email:</label>
        <input name="email" value={formData.email} onChange={handleChange} />

        {role === "admin_user" && (
          <>
            <label>Комісія (%):</label>
            <input name="commissionRate" value={formData.commissionRate} onChange={handleChange} />

            <label>Місто роботи:</label>
            <input name="workCity" value={formData.workCity} onChange={handleChange} />

            <label>Зарплата:</label>
            <input name="salary" value={formData.salary} onChange={handleChange} />
          </>
        )}

        <div className="agent-modal-buttons">
          <button className="save-btn" onClick={handleSubmit}>Зберегти</button>
          <button className="cancel-btn" onClick={onClose}>Скасувати</button>
        </div>
      </div>
    </div>
  );
};

export default EditAgentModal;
