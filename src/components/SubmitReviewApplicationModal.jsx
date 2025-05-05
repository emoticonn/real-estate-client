import { useState } from "react";
import "../styles/SubmitReviewApplicationModal.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SubmitReviewApplicationModal = ({ property, agents, onClose, onSubmitted }) => {
  const { token } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  // Фільтруємо агентів по місту нерухомості
  const filteredAgents = agents.filter(agent => 
    agent.workCity?.toLowerCase().trim() === property.city?.toLowerCase().trim()
  );
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        propertyID: property.propertyID,
        agentID: parseInt(selectedAgent),
        reviewDate: reviewDate
      };

      await axios.post("https://localhost:7252/api/applicationforreview", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(`Заявка відправлена успішно!`);
      onSubmitted(); // Якщо потрібно перезавантажити список
      onClose();     // І закрити модалку
    } catch (error) {
      console.error("Помилка при подачі заявки:", error);
      alert("Помилка при подачі заявки.");
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="review-close-button" onClick={onClose}>×</button>
        <h2>Запис на перегляд</h2>
        <form onSubmit={handleSubmit} className="review-form">

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            required
          >
            <option value="">Оберіть агента</option>
            {filteredAgents.map(agent => (
              <option key={agent.agentID} value={agent.agentID}>
              {agent.firstName} {agent.lastName} ({agent.WorkCity})
            </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            required
          />

          <button type="submit">Подати заявку</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewApplicationModal;
