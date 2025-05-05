import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaUserCircle } from "react-icons/fa";
import PropertyCard from "../components/PropertyCard";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import SubmitPropertyModal from "../components/SubmitPropertyModal";
import "../styles/HomePage.css";
import { useParams } from "react-router-dom";

const HomePage = () => {
  const { token, username, logout } = useAuth();
  const { type } = useParams(); // 'rent', 'sale' або undefined
  const [properties, setProperties] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = "https://localhost:7252/api/property/allorders"; // за замовчуванням

      if (type === "rent") {
        endpoint = "https://localhost:7252/api/property/filter?status=for_rent";
      } else if (type === "sale") {
        endpoint = "https://localhost:7252/api/property/filter?status=for_sale";
      }

      const res = await axios.get(endpoint);
      setProperties(res.data);
    } catch (err) {
      console.error("Помилка завантаження:", err);
      setProperties([]); // Очистити у випадку помилки
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchProperties(); // кожного разу при зміні type або після додавання
  }, [type, fetchProperties]);

  const handleSubmitPropertyClick = () => {
    if (token) {
      setShowSubmitModal(true);
    } else {
      setShowLogin(true);
    }
  };

  const handlePropertySubmitted = () => {
    setShowSubmitModal(false);
    fetchProperties(); // перезавантаження даних після додавання нового об'єкта
  };

  return (
    <div className="dashboard-wrapper">
      {/* Topbar */}
      <div className="topbar">
        <h3>Агентство нерухомості</h3>
        {username ? (
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
        ) : (
          <div>
            <button onClick={() => setShowLogin(true)}>Увійти</button>
            <button onClick={() => setShowRegister(true)}>Реєстрація</button>
          </div>
        )}
      </div>

      {/* Sidebar + Main Content */}
      <div className="dashboard-body">
        <Sidebar onSubmitPropertyClick={handleSubmitPropertyClick} />
        <main className="main-content">
          <h1>
            {type === "rent"
              ? "Оголошення про оренду нерухомості"
              : type === "sale"
              ? "Оголошення про продаж нерухомості"
              : "Останні додані об'єкти"}
          </h1>

          {loading ? (
            <p>Завантаження...</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard key={property.propertyID} property={property} />
                ))
              ) : (
                <p>Немає доступних об'єктів для перегляду.</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Модальні вікна */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {showSubmitModal && (
        <SubmitPropertyModal onClose={() => setShowSubmitModal(false)} onSubmitted={handlePropertySubmitted} />
      )}
    </div>
  );
};

export default HomePage;
