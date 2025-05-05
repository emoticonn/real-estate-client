import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import SubmitPropertyPage from "./pages/SubmitPropertyPage";
import FinancePage from "./pages/FinancePage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ClientsPage from "./pages/ClientsPage";
import AgentsPage from "./pages/AgentsPage";
import AdminPanel from "./pages/AdminPanel";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import ClientDealsPage from "./pages/ClientDealsPage";
import AgentProfilePage from "./pages/AgentProfilePage"; 
import ConfirmedApplicationsPage from "./pages/ConfirmedApplicationsPage"; 
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Публічні маршрути */}
      <Route path="/" element={<HomePage />} />
      <Route path="/properties/:type" element={<HomePage />} />
      <Route path="/property/:id" element={<PropertyDetailsPage />} />

      {/* Захищені маршрути */}
      <Route path="/submit-property" element={<ProtectedRoute><SubmitPropertyPage /></ProtectedRoute>} />
      <Route path="/finance" element={<ProtectedRoute allowedRoles={["accountant", "admin_user"]}><FinancePage /></ProtectedRoute>} />
      <Route path="/applications" element={<ProtectedRoute allowedRoles={["agent", "admin_user"]}><ApplicationsPage /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute allowedRoles={["agent", "admin_user"]}><ClientsPage /></ProtectedRoute>} />
      <Route path="/agents" element={<ProtectedRoute allowedRoles={["accountant", "admin_user"]}><AgentsPage /></ProtectedRoute>} />

      {/* Угоди клієнта і адміна */}
      <Route path="/my-deals" element={<ProtectedRoute allowedRoles={["client"]}><ClientDealsPage /></ProtectedRoute>} />
      <Route path="/deals" element={<ProtectedRoute allowedRoles={["admin_user"]}><ClientDealsPage /></ProtectedRoute>} />

      {/* 🆕 Профіль агента */}
      <Route path="/agent-profile/:id" element={<ProtectedRoute allowedRoles={["agent", "admin_user"]}><AgentProfilePage /></ProtectedRoute>} />

      {/* 🆕 Заявки з підтвердженим статусом */}
      <Route path="/confirmed-applications" element={<ProtectedRoute allowedRoles={["agent"]}><ConfirmedApplicationsPage /></ProtectedRoute>} />

      {/* Маршрути адміністратора */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin_user"]}><AdminPanel /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute allowedRoles={["admin_user"]}><UsersPage /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute allowedRoles={["admin_user"]}><RolesPage /></ProtectedRoute>} />

      {/* Перенаправлення */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
