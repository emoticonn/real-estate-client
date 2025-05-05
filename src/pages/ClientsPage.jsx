import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaUserCircle } from "react-icons/fa";
import "../styles/HomePage.css"; // замінили з ClientsPage.css

const ClientDealsPage = () => {
  const { token, userId, username, logout, role } = useAuth();
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
            <span className="username">{username}</span>
            <FaUserCircle size={28} className="user-icon" />
            {menuOpen && (
              <div className="profile-dropdown">
                <button onClick={() => alert("Перехід до профілю")}>Профіль</button>
                <button onClick={logout}>Вийти</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">
          <h2>{role === "admin_user" ? "Угоди користувачів" : "Ваші договори"}</h2>
          {loading ? (
            <p>Завантаження угод...</p>
          ) : deals.length === 0 ? (
            <p>Немає угод.</p>
          ) : (
            <div className="client-deals-list">
              {deals.map((deal, idx) => (
                <div key={idx} className="client-deal-card">
                  <div className="deal-section">
                    <h3>{deal.dealType}</h3>
                    <p><strong>Адреса:</strong> {deal.propertyAddress}</p>
                    <p><strong>Ціна:</strong> {deal.price} грн</p>
                    <p><strong>Дата:</strong> {new Date(deal.date).toLocaleDateString()}</p>
                    {deal.startDate && (
                      <>
                        <p><strong>Початок оренди:</strong> {new Date(deal.startDate).toLocaleDateString()}</p>
                        <p><strong>Кінець оренди:</strong> {new Date(deal.endDate).toLocaleDateString()}</p>
                      </>
                    )}
                  </div>

                  {deal.agent && (
                    <div className="agent-section">
                      <h4>Агент</h4>
                      <p><strong>Ім’я:</strong> {deal.agent.firstName}</p>
                      <p><strong>Прізвище:</strong> {deal.agent.lastName}</p>
                    </div>
                  )}

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
