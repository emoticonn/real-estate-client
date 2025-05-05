import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import "../styles/FinancePage.css";

const months = [
  { value: 0, label: "Усі місяці" },
  { value: 1, label: "Січень" },
  { value: 2, label: "Лютий" },
  { value: 3, label: "Березень" },
  { value: 4, label: "Квітень" },
  { value: 5, label: "Травень" },
  { value: 6, label: "Червень" },
  { value: 7, label: "Липень" },
  { value: 8, label: "Серпень" },
  { value: 9, label: "Вересень" },
  { value: 10, label: "Жовтень" },
  { value: 11, label: "Листопад" },
  { value: 12, label: "Грудень" },
];

const currentYear = new Date().getFullYear();

const FinancePage = () => {
  const { username, logout, token } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [activeSection, setActiveSection] = useState("income");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const fetchFinanceMetrics = async () => {
      try {
        const res = await axios.get("https://localhost:7252/api/finance/metrics", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            year: selectedYear,
            month: selectedMonth === 0 ? null : selectedMonth
          }
        });
        setMetrics(res.data);
      } catch (error) {
        console.error("Помилка при завантаженні метрик:", error);
      }
    };

    if (token) fetchFinanceMetrics();
  }, [token, selectedMonth, selectedYear]);

  const handleDownload = async () => {
    try {
      const res = await axios.get("https://localhost:7252/api/finance/report", {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
        params: {
          year: selectedYear,
          month: selectedMonth === 0 ? null : selectedMonth
        }
      });

      const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Фінансовий_звіт_${selectedYear}_${selectedMonth || "всі"}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Помилка при завантаженні звіту:", err);
    }
  };

  const renderSection = () => {
    if (!metrics) return <p>Завантаження метрик...</p>;

    const labelMap = {
      income: "Прибуток",
      expenses: "Зарплати",
      net: "Чистий дохід",
      clients: "Клієнти"
    };

    const keyMap = {
      income: "totalIncome",
      expenses: "totalSalaries",
      net: "netProfit",
      clients: "totalClientsByAgents"
    };

    const total = metrics[keyMap[activeSection]];
    const timeline = metrics.timeline || [];

    const chartData = timeline.map(item => ({
      name: item.label,
      value: item[keyMap[activeSection]]
    }));

    return (
      <>
        <h2>{labelMap[activeSection]}</h2>
        <p>
          {activeSection === "income" && <>💰 Загальний прибуток: <strong>₴{total.toLocaleString()}</strong></>}
          {activeSection === "expenses" && <>💸 Зарплати: <strong>₴{total.toLocaleString()}</strong></>}
          {activeSection === "net" && <>📊 Чистий дохід: <strong>₴{total.toLocaleString()}</strong></>}
          {activeSection === "clients" && <>👥 Кількість угод: <strong>{total}</strong></>}
        </p>
        <ChartBar data={chartData} />
      </>
    );
  };

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
          <h1>📈 Фінансова аналітика</h1>

          <div className="filter-controls">
            <label>Рік: </label>
            <input
              type="number"
              min="2020"
              max={currentYear}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            />
            <label>Місяць: </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <button onClick={handleDownload} className="download-button">📥 Завантажити звіт</button>
          </div>

          <div className="finance-buttons">
            <button onClick={() => setActiveSection("income")}>Прибуток</button>
            <button onClick={() => setActiveSection("expenses")}>Витрати</button>
            <button onClick={() => setActiveSection("net")}>Чистий дохід</button>
            <button onClick={() => setActiveSection("clients")}>Клієнти</button>
          </div>

          <div className="finance-section">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

const formatValue = (val) => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)} млн`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)} тис`;
  return val;
};

const ChartBar = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="name" />
      <YAxis tickFormatter={formatValue} />
      <Tooltip formatter={(value) => [`₴${formatValue(value)}`, "Сума"]} />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

export default FinancePage;
