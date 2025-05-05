import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SubmitPropertyPage = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    area: "",
    rooms: "",
    price: "",
    status: "for_sale",
    floor: "",
    totalFloors: "",
    photoPath: "",
    description: ""
  });

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [reviewDate, setReviewDate] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchAgentsByCity = async (city) => {
    try {
      const res = await axios.get(`https://localhost:7252/api/agent`);
      const filtered = res.data.filter(agent => agent.workCity.toLowerCase() === city.toLowerCase());
      setAgents(filtered);
    } catch (err) {
      console.error("Помилка при завантаженні агентів:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Створюємо об'єкт нерухомості
      const res = await axios.post("https://localhost:7252/api/property", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const propertyId = res.data.propertyID;

      if (!selectedAgent || !reviewDate) {
        alert("Будь ласка, виберіть агента і дату перегляду!");
        return;
      }

      // Створюємо заявку на перегляд
      await axios.post("https://localhost:7252/api/applicationforreview", {
        propertyID: propertyId,
        agentID: selectedAgent,
        reviewDate: reviewDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Об'єкт і заявка на перегляд успішно подані!");
      setFormData({
        address: "",
        city: "",
        area: "",
        rooms: "",
        price: "",
        status: "for_sale",
        floor: "",
        totalFloors: "",
        photoPath: "",
        description: ""
      });
      setSelectedAgent("");
      setReviewDate("");
    } catch (error) {
      console.error("Помилка при подачі об'єкта:", error);
      alert("Помилка при подачі об'єкта або заявки.");
    }
  };

  useEffect(() => {
    if (formData.city.trim() !== "") {
      fetchAgentsByCity(formData.city);
    }
  }, [formData.city]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Подати нову нерухомість</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "500px" }}>
        <input type="text" name="address" placeholder="Адреса" value={formData.address} onChange={handleChange} required />
        <input type="text" name="city" placeholder="Місто" value={formData.city} onChange={handleChange} required />
        <input type="number" name="area" placeholder="Площа (м²)" value={formData.area} onChange={handleChange} required />
        <input type="number" name="rooms" placeholder="Кількість кімнат" value={formData.rooms} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Ціна (грн)" value={formData.price} onChange={handleChange} required />
        <input type="number" name="floor" placeholder="Поверх" value={formData.floor} onChange={handleChange} />
        <input type="number" name="totalFloors" placeholder="Всього поверхів" value={formData.totalFloors} onChange={handleChange} />
        <input type="text" name="photoPath" placeholder="Шлях до фото" value={formData.photoPath} onChange={handleChange} />
        <textarea name="description" placeholder="Опис нерухомості" value={formData.description} onChange={handleChange} rows="4" />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="for_sale">Продаж</option>
          <option value="for_rent">Оренда</option>
        </select>

        {/* Вибір агента */}
        {agents.length > 0 ? (
          <>
            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} required>
              <option value="">Виберіть агента для перегляду</option>
              {agents.map(agent => (
                <option key={agent.agentID} value={agent.agentID}>
                  {agent.firstName} {agent.lastName} ({agent.phone})
                </option>
              ))}
            </select>

            {/* Вибір дати */}
            <input
              type="datetime-local"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              required
            />
          </>
        ) : (
          <p>Немає агентів у цьому місті.</p>
        )}

        <button type="submit">Подати об'єкт і заявку на перегляд</button>
      </form>
    </div>
  );
};

export default SubmitPropertyPage;
