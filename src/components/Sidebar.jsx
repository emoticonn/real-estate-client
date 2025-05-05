import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ onSubmitPropertyClick }) => {
  const { role, token, userId } = useAuth();

  return (
    <aside className="sidebar">
      <h3>Меню</h3>
      <nav className="nav-links">
        <NavLink to="/" end>🏠 Головна</NavLink>
        <NavLink to="/properties/rent">📦 Оренда нерухомості</NavLink>
        <NavLink to="/properties/sale">🏡 Продаж нерухомості</NavLink>

        {token && (
          <button className="sidebar-button" onClick={onSubmitPropertyClick}>
            ➕ Подати об'єкт
          </button>
        )}

        {role === "client" && (
          <NavLink to="/my-deals">📜 Ваші договори</NavLink>
        )}

        {role === "agent" && (
          <>
            <NavLink to={`/agent-profile/${userId}`}>👤 Мій профіль</NavLink>
            <NavLink to="/clients">👥 Клієнти</NavLink>
            <NavLink to="/applications">📄 Заявки на перегляд</NavLink>
            <NavLink to="/confirmed-applications">✅ Підтверджені заявки</NavLink>
          </>
        )}

        {role === "accountant" && (
          <>
            <NavLink to="/finance">💰 Фінанси</NavLink>
            <NavLink to="/agents">👥 Агенти</NavLink>
          </>
        )}

        {role === "admin_user" && (
          <>
            <NavLink to="/admin">🛠️ Панель адміністратора</NavLink>
            <NavLink to="/users">👤 Користувачі</NavLink>
            <NavLink to="/roles">🔐 Ролі</NavLink>
            <NavLink to="/finance">💰 Фінанси</NavLink>
            <NavLink to="/agents">👥 Агенти</NavLink>
            <NavLink to="/deals">📜 Угоди користувачів</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
