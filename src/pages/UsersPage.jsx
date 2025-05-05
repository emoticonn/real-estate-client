import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import "../styles/UsersPage.css";

const UsersPage = () => {
  const { username, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* Sidebar + Main Content */}
      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content users-page">
          <h1>Користувачі</h1>
          <p>Список та керування користувачами.</p>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
