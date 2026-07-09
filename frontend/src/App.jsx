import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import CustomerPage from "./features/customers/CustomerPage"
import NotFoundPage from "./components/Layouts/NotFoundPage"
import Main from "./components/Layouts/Main"
import Login from "./features/auth/Login"
import Dashboard from "./features/dashboard/Dashboard"
import ServicePage from "./features/services/ServicePage"
import UserPage from "./features/users/UserPage"
import TransactionPage from "./features/transactions/TransactionPage"
import PickupPage from "./features/pickups/PickupPage"
import ReportPage from "./features/reports/ReportPage"
import authService from "./features/auth/services/auth.service"
import { ROLE_PERMISSIONS } from "./config/roles"

// Protected Route component
const ProtectedRoute = ({ allowedRoles }) => {
  const isAuth = authService.isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const user = authService.getCurrentUser();
    const role = user?.level_name;
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={
            authService.isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />

        {/* Protected Routes inside Main Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Main />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route element={<ProtectedRoute allowedRoles={ROLE_PERMISSIONS.customers} />}>
              <Route path="/customers" element={<CustomerPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={ROLE_PERMISSIONS.transactions} />}>
              <Route path="/transactions" element={<TransactionPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={ROLE_PERMISSIONS.pickups} />}>
              <Route path="/pickups" element={<PickupPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={ROLE_PERMISSIONS.services} />}>
              <Route path="/services" element={<ServicePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={ROLE_PERMISSIONS.users} />}>
              <Route path="/users" element={<UserPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={ROLE_PERMISSIONS.reports} />}>
              <Route path="/reports" element={<ReportPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
