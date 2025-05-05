import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import "../styles/HomePage.css";
import "../styles/ApplicationsModal.css";

const ApplicationsPage = () => {
  const { username, logout, token, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const ukToEnStatus = {
    "підтверджено": "confirmed",
    "відхилено": "rejected",
    "проведено": "conducted",
    "завершено": "completed"
  };

  const fetchAppointmentsForAgent = async () => {
    try {
      const appsRes = await axios.get(`https://localhost:7252/api/applicationforreview/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const propertyRes = await axios.get(`https://localhost:7252/api/property`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const clientRes = await axios.get(`https://localhost:7252/api/client`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const properties = propertyRes.data;
      const clients = clientRes.data;

      const mergedAppointments = appsRes.data.map(app => {
        const property = properties.find(p => p.propertyID === app.propertyID);
        const client = clients.find(c => c.clientID === app.clientID);
        return {
          applicationID: app.applicationID,
          address: property?.address || "Невідомо",
          clientName: client ? `${client.firstName} ${client.lastName}` : "Невідомий",
          phone: client?.phone || "Невідомо",
          reviewDate: app.reviewDate,
          status: app.status
        };
      });

      setAppointments(mergedAppointments);
    } catch (err) {
      console.error("Помилка завантаження переглядів:", err);
    }
  };

  useEffect(() => {
    if (role === "agent" && token) {
      fetchAppointmentsForAgent();
    }
  }, [role, token]);

  const handleCardClick = (appointment) => {
    setSelectedApp(appointment);
    setNewStatus(ukToEnStatus[appointment.status.toLowerCase()] || "confirmed");
  };

  const handleStatusChange = async () => {
    if (!selectedApp) return;

    const payload = { Status: newStatus };
    console.log("Відправляємо статус:", payload);

    try {
      await axios.put(
        `https://localhost:7252/api/applicationforreview/${selectedApp.applicationID}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Статус успішно оновлено!");
      setSelectedApp(null);
      fetchAppointmentsForAgent();
    } catch (error) {
      console.error("Помилка при оновленні статусу:", error);
      if (error.response?.data) {
        alert(`Помилка: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Не вдалося оновити статус.");
      }
    }
  };

  const closeModal = () => {
    setSelectedApp(null);
  };

  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const displayedAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <h3>Агентство нерухомості</h3>
        {username && (
          <div
            className="profile-container"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <span>{username}</span>
            <FaUserCircle size={28} />
            {menuOpen && (
              <div className="profile-dropdown">
                <button>Профіль</button>
                <button onClick={logout}>Вийти</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">
          <h2>Заявки на перегляд</h2>

          {role === null ? (
            <p>Завантаження...</p>
          ) : role === "agent" ? (
            displayedAppointments.length > 0 ? (
              displayedAppointments.map((app, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCardClick(app)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    backgroundColor: "#f9f9f9"
                  }}
                >
                  <p><strong>Адреса:</strong> {app.address}</p>
                  <p><strong>Клієнт:</strong> {app.clientName}</p>
                  <p><strong>Телефон:</strong> {app.phone}</p>
                  <p><strong>Дата перегляду:</strong> {new Date(app.reviewDate).toLocaleString()}</p>
                  <p><strong>Статус:</strong> {app.status}</p>
                </div>
              ))
            ) : (
              <p>Немає запланованих переглядів.</p>
            )
          ) : (
            <p>У вас немає доступу до заявок.</p>
          )}

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx + 1}
                className={currentPage === idx + 1 ? "active" : ""}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {selectedApp && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="modal-close-button" onClick={closeModal}>×</button>
                <h3>Змінити статус заявки</h3>
                <p><strong>Адреса:</strong> {selectedApp.address}</p>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="confirmed">Підтверджено</option>
                  <option value="rejected">Відхилено</option>
                  <option value="conducted">Проведено</option>
                  <option value="completed">Завершено</option>
                </select>
                <div className="modal-button-group">
                  <button onClick={handleStatusChange}>Оновити</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ApplicationsPage;
