import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import EditAgentModal from "../components/EditAgentModal";
import axios from "axios";
import "../styles/AgentsPage.css";

const AgentsPage = () => {
  const { username, logout, token } = useAuth();
  const [agents, setAgents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get("https://localhost:7252/api/agent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgents(res.data);
      } catch (error) {
        console.error("Помилка при завантаженні агентів:", error);
      }
    };

    if (token) fetchAgents();
  }, [token]);

  const handleCardClick = (agent) => {
    setSelectedAgent(agent);
  };

  const handleModalClose = () => {
    setSelectedAgent(null);
  };

  const handleAgentSave = (updatedData) => {
    axios
      .put(`https://localhost:7252/api/agent/${updatedData.agentID}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSelectedAgent(null);
        return axios.get("https://localhost:7252/api/agent", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => setAgents(res.data))
      .catch((error) => {
        console.error("Помилка при оновленні агента:", error);
      });
  };

  return (
    <div className="dashboard-wrapper">
      {/* Topbar */}
      <div className="topbar">
        <h3>Список агентів</h3>
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
                <button onClick={() => alert("Перехід до профілю")}>Профіль</button>
                <button onClick={logout}>Вийти</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar + Main */}
      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">
          {agents.length === 0 ? (
            <p>Немає доступних агентів.</p>
          ) : (
            <div className="agents-list">
              {agents.map((agent) => (
                <div key={agent.agentID} className="agent-card" onClick={() => handleCardClick(agent)}>
                  <div className="agent-photo">
                    {agent.photoPath && agent.photoPath !== "string" ? (
                      <img
                        src={`https://localhost:7252/${agent.photoPath}`}
                        alt={`${agent.firstName} ${agent.lastName}`}
                      />
                    ) : (
                      <FaUserCircle size={48} />
                    )}
                  </div>
                  <div className="agent-info">
                    <h4>{agent.firstName} {agent.lastName}</h4>
                    <p>📞 {agent.phone}</p>
                    <p>✉️ {agent.email}</p>
                    <p>💼 Комісія: {agent.commissionRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedAgent && (
        <EditAgentModal
          agent={selectedAgent}
          onClose={handleModalClose}
          token={token}
          onSave={handleAgentSave}
        />
      )}
    </div>
  );
};

export default AgentsPage;
