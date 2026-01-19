import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import DashboardLayout from "./components/DashboardLayout";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Properties />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/add"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AddProperty />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/:id/edit"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <EditProperty />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <PropertyDetail />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ChangePassword />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
