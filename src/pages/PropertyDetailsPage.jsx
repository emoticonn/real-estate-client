import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { FaUserCircle } from "react-icons/fa";
import SubmitReviewApplicationModal from "../components/SubmitReviewApplicationModal";
import EditPropertyModal from "../components/EditPropertyModal";
import "../styles/PropertyDetailsPage.css";
import { FaEdit, FaRegCalendarCheck } from "react-icons/fa";

const PropertyDetailsPage = () => {
  const { username, logout, token, role } = useAuth();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [agents, setAgents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`https://localhost:7252/api/property/${id}`);
      setProperty(res.data);
    } catch (err) {
      console.error("Помилка завантаження об'єкта", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const fetchAgents = async () => {
      if (property?.city) {
        try {
          const res = await axios.get(`https://localhost:7252/api/agent`);
          const filtered = res.data.filter(agent => agent.workCity?.toLowerCase() === property.city.toLowerCase());
          setAgents(filtered);
        } catch (err) {
          console.error("Помилка при завантаженні агентів:", err);
        }
      }
    };
    fetchAgents();
  }, [property?.city]);

  const images = [];
  if (property?.galleryPaths) {
    images.push(...property.galleryPaths.split(",").map(p => p.trim()));
  }
  if (property?.photoPath) {
    images.unshift(property.photoPath);
  }

  const handleNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
  };

  const isOwner = property?.ownerUsername === username;

  const handlePropertyUpdate = async (updatedData) => {
    try {
      await axios.put(`https://localhost:7252/api/property/${property.propertyID}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchProperty(); // ⬅ оновити об'єкт після PUT
      setShowEditModal(false);
      alert("Дані успішно оновлено.");
    } catch (err) {
      console.error("Помилка при оновленні об'єкта:", err);
    }
  };

  if (loading) return <div className="loading">Завантаження...</div>;
  if (!property) return <div className="error">Об'єкт не знайдено</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="topbar">
        <h3>Агентство нерухомості</h3>
        {username ? (
          <div className="profile-container" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={() => setMenuOpen(false)}>
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
            <button onClick={() => alert("Увійти")}>Увійти</button>
            <button onClick={() => alert("Реєстрація")}>Реєстрація</button>
          </div>
        )}
      </div>

      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">
          <div className="property-details">
            <div className="carousel">
              {images.length > 0 && (
                <>
                  <img
                    src={`https://localhost:7252/${images[currentImageIndex]}`}
                    alt="Фото нерухомості"
                    className="carousel-image"
                  />
                  {images.length > 1 && (
                    <>
                      <button className="prev-button" onClick={handlePrevImage}>‹</button>
                      <button className="next-button" onClick={handleNextImage}>›</button>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="property-info">
              <p><strong>Адреса:</strong> {property.address}</p>
              <p><strong>{property.status === "for_sale" ? "Ціна продажу:" : "Ціна оренди:"}</strong> {property.price.toLocaleString()} грн</p>
              <p><strong>Місто:</strong> {property.city}</p>
              <p><strong>Площа:</strong> {property.area} м²</p>
              <p><strong>Кімнат:</strong> {property.rooms}</p>
              <p><strong>Поверх:</strong> {property.floor} з {property.totalFloors}</p>
              <p><strong>Опис:</strong> {property.description || "Опис відсутній"}</p>
            </div>
          </div>

          {(token && (role === "admin_user" || isOwner)) && (
  <div className="property-actions">
    <div className="button-group">
      <button className="action-button open-review-modal-button" onClick={() => setShowReviewModal(true)}>
        <FaRegCalendarCheck /> Записатись на перегляд
      </button>
      <button className="action-button edit-button" onClick={() => setShowEditModal(true)}>
        <FaEdit /> Редагувати
      </button>
    </div>
  </div>
)}


          {showReviewModal && (
            <SubmitReviewApplicationModal
              property={property}
              agents={agents}
              token={token}
              onClose={() => setShowReviewModal(false)}
              onSubmitted={() => setShowReviewModal(false)}
            />
          )}

          {showEditModal && (
            <EditPropertyModal
              property={property}
              onClose={() => setShowEditModal(false)}
              onSave={handlePropertyUpdate}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
