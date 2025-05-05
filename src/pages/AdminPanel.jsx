import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminPanel.css"; // Стилі адмінки
import "../styles/AgentsPage.css"; // Стилі карток агентів

const AdminPanel = () => {
  const { username, logout, token } = useAuth();
  const [agents, setAgents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgentsWithClients = async () => {
      try {
        const res = await axios.get("https://localhost:7252/api/agent/withclients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgents(res.data);
      } catch (error) {
        console.error("Помилка при завантаженні агентів з клієнтами:", error);
      }
    };

    fetchAgentsWithClients();
  }, [token]);

  const handleAgentClick = (agentId) => {
    navigate(`/agents/${agentId}`);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <h3>Адміністративна панель</h3>
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
          <h2>Агенти, що мають клієнтів</h2>
          <div className="agent-cards-container">
            {agents.length > 0 ? (
              agents.map((agent) => (
                <div key={agent.agentID} className="agent-card" onClick={() => handleAgentClick(agent.agentID)}>
                  <div className="agent-photo">
                    <img src={`https://localhost:7252/${agent.photoPath}`} alt={`${agent.firstName} ${agent.lastName}`} />
                  </div>
                  <div className="agent-info">
                    <h3>{agent.firstName} {agent.lastName}</h3>
                    <p>📞 {agent.phone}</p>
                    <p>✉️ {agent.email}</p>
                    <p>Клієнтів: {agent.clientCount}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Наразі немає агентів з клієнтами.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
