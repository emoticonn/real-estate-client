import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import EditAgentModal from "../components/EditAgentModal";
import "../styles/AgentProfilePage.css";

const AgentProfilePage = () => {
  const { username, logout, token } = useAuth();
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [history, setHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ повідомлення

  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const agentRes = await axios.get(`https://localhost:7252/api/agent/by-user/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgent(agentRes.data);

        const historyRes = await axios.get(`https://localhost:7252/api/agent/${agentRes.data.agentID}/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(historyRes.data);
      } catch (error) {
        console.error("Помилка при завантаженні даних агента:", error);
      }
    };

    fetchAgentProfile();
  }, [id, token]);

  const handleAgentUpdate = async (updatedAgent) => {
    try {
      await axios.put(`https://localhost:7252/api/agent/${updatedAgent.agentID}`, updatedAgent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgent(updatedAgent);
      setShowEditModal(false);
      setSuccessMessage("✅ Дані оновлено успішно"); // ✅ показати повідомлення

      // ❌ Сховати через 3 секунди
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Помилка при оновленні агента:", err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <h3>Профіль агента</h3>
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
          {successMessage && <div className="success-message">{successMessage}</div>} {/* ✅ блок повідомлення */}

          {agent ? (
            <>
              <div className="agent-card" onClick={() => setShowEditModal(true)} style={{ cursor: "pointer" }}>
                <img className="agent-photo" src={`https://localhost:7252/${agent.photoPath}`} alt="agent" />
                <div className="agent-info">
                  <h2 className="agent-name">{agent.firstName} {agent.lastName}</h2>
                  <p className="agent-detail"><span className="agent-label">📞 Телефон:</span> {agent.phone}</p>
                  <p className="agent-detail"><span className="agent-label">✉️ Email:</span> {agent.email}</p>
                  <p className="agent-detail"><span className="agent-label">Комісія:</span> {agent.commissionRate}%</p>
                  <p className="agent-detail"><span className="agent-label">Місто:</span> {agent.workCity || 'Невідомо'}</p>
                  <p className="agent-detail"><span className="agent-label">Зарплата:</span> {agent.salary?.toLocaleString() || 'Невідомо'} грн</p>
                </div>
              </div>

              <h3>Історія взаємодій:</h3>
              {history.length ? (
                history.map((item, idx) => (
                  <div key={idx} className="history-card">
                    <p><strong>{item.type === "application" ? "Заявка на перегляд" : "Угода"}</strong></p>
                    <p>Клієнт: {item.clientName}</p>
                    <p>📅 {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p>Історія взаємодій відсутня.</p>
              )}

              {showEditModal && (
                <EditAgentModal
                  agent={agent}
                  onClose={() => setShowEditModal(false)}
                  onSave={handleAgentUpdate}
                />
              )}
            </>
          ) : (
            <p>Завантаження даних агента...</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default AgentProfilePage;
