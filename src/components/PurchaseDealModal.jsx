import { useState } from "react";
import axios from "axios";
import "../styles/DealModal.css";

const PurchaseDealModal = ({ onClose, data, token }) => {
  const { client, property, agent } = data;

  const [dealDate, setDealDate] = useState("");
  const [dealPrice, setDealPrice] = useState(property.price || 0);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dealDate || !file) {
      setError("Заповніть дату та завантажте файл договору.");
      return;
    }

    const formData = new FormData();
    formData.append("PropertyID", property.propertyID);
    formData.append("BuyerID", client.clientID);
    formData.append("AgentID", agent.agentID);
    formData.append("DealDate", dealDate);
    formData.append("DealPrice", dealPrice);
    formData.append("File", file);

    try {
      await axios.post("https://localhost:7252/api/purchasedeal/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      onClose();
    } catch (err) {
      console.error("Purchase deal error:", err);
      setError("Не вдалося створити договір купівлі.");
    }
  };

  return (
    <div className="purchase-modal-overlay">
      <div className="purchase-modal">
        <button onClick={onClose} className="purchase-close-button">×</button>
        <h2>Оформлення договору купівлі</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Дата угоди:</label>
            <input type="date" value={dealDate} onChange={(e) => setDealDate(e.target.value)} required />
          </div>
          <div>
            <label>Ціна об’єкта (грн):</label>
            <input type="number" value={dealPrice} onChange={(e) => setDealPrice(e.target.value)} required />
          </div>
          <div>
            <label>Файл договору (PDF / фото):</label>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} required />
          </div>

          <button type="submit">Створити договір купівлі</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PurchaseDealModal;
