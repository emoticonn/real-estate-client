import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaUserCircle } from "react-icons/fa";
import "../styles/ClientDealsPage.css";

const ClientDealsPage = () => {
  const { token, userId, username, role, logout } = useAuth();
  const [deals, setDeals] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const endpoint =
          role === "admin_user"
            ? "https://localhost:7252/api/client/all-deals"
            : `https://localhost:7252/api/client/${userId}/deals`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeals(response.data);
      } catch (error) {
        console.error("Помилка при завантаженні угод:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && userId && role) {
      fetchDeals();
    }
  }, [token, userId, role]);

  if (loading) return <div>Завантаження угод...</div>;

  return (
    <div className="dashboard-wrapper">
      {/* Topbar */}
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
                <button onClick={() => alert("Перехід до профілю")}>Профіль</button>
                <button onClick={logout}>Вийти</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar + Main Content */}
      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">
          <h2>{role === "admin_user" ? "Угоди користувачів" : "Ваші договори"}</h2>

          {deals.length === 0 ? (
            <p>Немає угод.</p>
          ) : (
            <div className="client-deals-list">
              {deals.map((deal, idx) => (
                <div key={idx} className="client-deal-card">
                  {/* Інформація про угоду */}
                  <div className="deal-section">
                    <h3>{deal.dealType}</h3>
                    <p><strong>Нерухомість:</strong> {deal.propertyAddress}</p>
                    <p><strong>Ціна:</strong> {deal.price} грн</p>
                    <p><strong>Дата:</strong> {new Date(deal.date).toLocaleDateString()}</p>
                    {deal.dealType === "Оренда" && deal.startDate && deal.endDate && (
                      <>
                        <p><strong>Дата початку:</strong> {new Date(deal.startDate).toLocaleDateString()}</p>
                        <p><strong>Дата завершення:</strong> {new Date(deal.endDate).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>

                  {/* Агент */}
                  {deal.agent && (
                    <div className="agent-section">
                      <h4>Агент</h4>
                      <p><strong>Ім’я:</strong> {deal.agent.firstName}</p>
                      <p><strong>Прізвище:</strong> {deal.agent.lastName}</p>
                    </div>
                  )}

                  {/* Клієнт (тільки для адміна) */}
                  {role === "admin_user" && deal.client && (
                    <div className="client-section">
                      <h4>Клієнт</h4>
                      <p><strong>Ім’я:</strong> {deal.client.firstName}</p>
                      <p><strong>Прізвище:</strong> {deal.client.lastName}</p>
                      <p><strong>Телефон:</strong> {deal.client.phone}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDealsPage;
