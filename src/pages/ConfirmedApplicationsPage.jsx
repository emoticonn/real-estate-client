import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PurchaseDealModal from "../components/PurchaseDealModal";
import RentDealModal from "../components/RentDealModal";
import Sidebar from "../components/Sidebar";
import { FaUserCircle } from "react-icons/fa";
import "../styles/HomePage.css";
import "../styles/ConfirmedApplicationsPage.css";

const ConfirmedApplicationsPage = () => {
  const { token, role, username, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchConfirmedApplications = async () => {
    try {
      const [appsRes, propsRes, clientsRes] = await Promise.all([
        axios.get("https://localhost:7252/api/applicationforreview/all", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://localhost:7252/api/property", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://localhost:7252/api/client", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const filteredApps = appsRes.data.filter(app =>
        ["підтверджено", "проведено", "завершено"].includes(app.status.toLowerCase())
      );

      const merged = filteredApps.map(app => {
        const property = propsRes.data.find(p => p.propertyID === app.propertyID);
        const client = clientsRes.data.find(c => c.clientID === app.clientID);
        return { applicationID: app.applicationID, property, client, agentID: app.agentID };
      });

      setApplications(merged);
    } catch (err) {
      console.error("Помилка при завантаженні заявок:", err);
    }
  };

  useEffect(() => {
    if (token && role === "agent") fetchConfirmedApplications();
  }, [token, role]);

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApps = applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <h3>Підтверджені заявки</h3>
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
          <div className="button-bar">
            <button onClick={() => window.open("/downloads/sample-purchase.pdf")}>
              Завантажити шаблон купівлі
            </button>
            <button onClick={() => window.open("/downloads/sample-rent.pdf")}>
              Завантажити шаблон оренди
            </button>
          </div>

          {paginatedApps.map((app, idx) => (
            <div key={idx} className="deal-panel">
              <div className="client-info">
                <p><strong>Ім'я:</strong> {app.client.firstName}</p>
                <p><strong>Прізвище:</strong> {app.client.lastName}</p>
                <p><strong>Телефон:</strong> {app.client.phone}</p>
                <p><strong>Email:</strong> {app.client.email}</p>
              </div>
              <div className="property-info">
                <p><strong>Адреса нерухомості:</strong><br />{app.property.address}</p>
                <p>
                  <strong>Ціна:</strong>{" "}
                  {app.property.status === "for_rent"
                    ? `${app.property.propertyDetails?.monthlyRent || "—"} грн / міс.`
                    : `${app.property.price} грн`}
                </p>
                <p><strong>Тип:</strong> {app.property.status === "for_rent" ? "Оренда" : "Продаж"}</p>
                <button
                  onClick={() => setActiveModal({
                    type: app.property.status,
                    data: {
                      agent: { agentID: app.agentID },
                      client: app.client,
                      property: app.property
                    }
                  })}
                >
                  {app.property.status === 'for_rent' ? "Оформити договір оренди" : "Оформити договір купівлі"}
                </button>
              </div>
            </div>
          ))}

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

          {activeModal && activeModal.type === 'for_sale' && (
            <PurchaseDealModal
              onClose={() => setActiveModal(null)}
              data={activeModal.data}
              token={token}
            />
          )}

          {activeModal && activeModal.type === 'for_rent' && (
            <RentDealModal
              onClose={() => setActiveModal(null)}
              data={activeModal.data}
              token={token}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ConfirmedApplicationsPage;
