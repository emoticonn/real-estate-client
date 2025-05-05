import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import "../styles/RolesPage.css";
import RoleChangeModal from "../components/RoleChangeModal";

const RolesPage = () => {
  const { username, logout, token } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://localhost:7252/api/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Помилка завантаження користувачів:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const displayedUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                <button>Профіль</button>
                <button onClick={logout}>Вийти</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar + Content */}
      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">
          <h1>Ролі користувачів</h1>

          <div className="user-cards-container">
            {displayedUsers.map(user => (
              <div key={user.userID} className="user-card" onClick={() => setSelectedUser(user)}>
                <div className="user-card-info">
                  <h2>{user.firstName} {user.lastName}</h2>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Роль:</strong> {user.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Пагінація */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&lt;</button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          )}
        </main>
      </div>

      {/* Модалка зміни ролі */}
      {selectedUser && (
        <RoleChangeModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onRoleUpdated={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default RolesPage;
