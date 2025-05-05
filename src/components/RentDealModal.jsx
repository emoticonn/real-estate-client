import { useState } from "react";
import axios from "axios";
import "../styles/DealModal.css";

const RentDealModal = ({ onClose, data, token }) => {
  const { client, property, agent } = data;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monthlyRent, setMonthlyRent] = useState(property.price || 0);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !file) {
      setError("Заповніть усі поля та завантажте файл договору.");
      return;
    }

    const formData = new FormData();
    formData.append("PropertyID", property.propertyID);
    formData.append("TenantID", client.clientID);
    formData.append("AgentID", agent.agentID);
    formData.append("StartDate", startDate);
    formData.append("EndDate", endDate);
    formData.append("MonthlyRent", monthlyRent);
    formData.append("File", file);

    try {
      await axios.post("https://localhost:7252/api/rentdeal/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      onClose();
    } catch (err) {
      console.error("Rent deal error:", err);
      setError("Не вдалося створити договір оренди.");
    }
  };

  return (
    <div className="deal-modal-overlay">
  <div className="deal-modal">
  <button onClick={onClose} className="deal-close-button">×</button>
        <h2>Оформлення договору оренди</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Початок оренди:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label>Завершення оренди:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <div>
            <label>Ціна / місяць (грн):</label>
            <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} required />
          </div>
          <div>
            <label>Файл договору (PDF / фото):</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} required />
          </div>

          <button type="submit">Створити договір оренди</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default RentDealModal;
