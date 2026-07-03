/**
 * AppRouter.tsx
 * PhishGuard AI — Central React Router configuration
 */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import URLScannerPage from "../pages/dashboard/URLScannerPage";
import EmailScannerPage from "../pages/dashboard/EmailScannerPage";
import WebsiteScannerPage from "../pages/dashboard/WebsiteScannerPage";
import ThreatIntelPage from "../pages/dashboard/ThreatIntelPage";
import ReportsPage from "../pages/dashboard/ReportsPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import SettingsPage from "../pages/dashboard/SettingsPage";
import AdminPanelPage from "../pages/admin/AdminPanelPage";
import ExtensionPopup from "../pages/extension/ExtensionPopup";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/extension" element={<ExtensionPopup />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/url-scanner" element={<ProtectedRoute><URLScannerPage /></ProtectedRoute>} />
      <Route path="/dashboard/email-scanner" element={<ProtectedRoute><EmailScannerPage /></ProtectedRoute>} />
      <Route path="/dashboard/website-scanner" element={<ProtectedRoute><WebsiteScannerPage /></ProtectedRoute>} />
      <Route path="/dashboard/threat-intel" element={<ProtectedRoute><ThreatIntelPage /></ProtectedRoute>} />
      <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/admin" element={<ProtectedRoute><AdminPanelPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
