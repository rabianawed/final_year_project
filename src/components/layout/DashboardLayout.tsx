/**
 * DashboardLayout.tsx
 * PhishGuard AI — Shared shell for all authenticated pages
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, LayoutDashboard, Link2, Mail, Globe, Radar, FileText,
  User, Settings, ShieldAlert, Bell, Search, Sun, Moon, ChevronDown,
  LogOut, UserCircle, Key, Menu, X, Zap
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

interface NavLink {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { label: "URL Scanner", icon: <Link2 size={18} />, href: "/dashboard/url-scanner" },
  { label: "Email Scanner", icon: <Mail size={18} />, href: "/dashboard/email-scanner" },
  { label: "Website Scanner", icon: <Globe size={18} />, href: "/dashboard/website-scanner" },
  { label: "Threat Intelligence", icon: <Radar size={18} />, href: "/dashboard/threat-intel", badge: 12 },
  { label: "Reports", icon: <FileText size={18} />, href: "/dashboard/reports" },
];

const ACCOUNT_LINKS: NavLink[] = [
  { label: "Profile", icon: <User size={18} />, href: "/dashboard/profile" },
  { label: "Settings", icon: <Settings size={18} />, href: "/dashboard/settings" },
  { label: "Admin Panel", icon: <ShieldAlert size={18} />, href: "/dashboard/admin" },
];

const linkStyle = (active: boolean): React.CSSProperties => ({
  display: "flex",
  alignItems: "center",
  gap: 11,
  padding: "10px 14px",
  borderRadius: 10,
  textDecoration: "none",
  fontSize: 13.5,
  fontWeight: 500,
  color: active ? "#fff" : "#94a3b8",
  background: active ? "rgba(37,99,235,.16)" : "transparent",
  border: active ? "1px solid rgba(37,99,235,.3)" : "1px solid transparent",
  transition: "all .15s",
  marginBottom: 2,
});

const Sidebar: React.FC<{ activePath: string; mobileOpen: boolean; onClose: () => void }> = ({
  activePath,
  mobileOpen,
  onClose,
}) => {
  const renderLink = (link: NavLink) => {
    const active = activePath === link.href;
    return (
      <Link
        key={link.href}
        to={link.href}
        onClick={onClose}
        style={linkStyle(active)}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = "rgba(255,255,255,.04)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        <span style={{ color: active ? "#60a5fa" : "#475569", display: "flex", flexShrink: 0 }}>
          {link.icon}
        </span>
        {link.label}
        {link.badge ? (
          <span
            style={{
              marginLeft: "auto",
              background: "rgba(239,68,68,.15)",
              color: "#f87171",
              fontSize: 10.5,
              fontWeight: 700,
              padding: "1px 7px",
              borderRadius: 99,
              border: "1px solid rgba(239,68,68,.3)",
            }}
          >
            {link.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <>
      {mobileOpen ? (
        <div
          onClick={onClose}
          className="sidebar-overlay"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 40 }}
          aria-hidden
        />
      ) : null}

      <aside
        className={`dashboard-sidebar${mobileOpen ? " open" : ""}`}
        style={{
          width: 248,
          flexShrink: 0,
          background: "#0F172A",
          borderRight: "1px solid rgba(255,255,255,.06)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "sticky",
          top: 0,
          padding: "20px 14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 8px 22px",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={15} color="#fff" />
            </div>
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>
              Phish<span style={{ color: "#60a5fa" }}>Guard</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="sidebar-close"
            style={{ background: "none", border: "none", color: "#64748b", display: "none", cursor: "pointer" }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <Link
          to="/dashboard/url-scanner"
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: "#2563EB",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            padding: "10px",
            borderRadius: 10,
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          <Zap size={14} /> Quick Scan
        </Link>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: "#334155",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              padding: "0 14px 8px",
            }}
          >
            Detection
          </div>
          {NAV_LINKS.map(renderLink)}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: "#334155",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              padding: "0 14px 8px",
            }}
          >
            Account
          </div>
          {ACCOUNT_LINKS.map(renderLink)}
        </div>

        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              background: "rgba(34,197,94,.08)",
              border: "1px solid rgba(34,197,94,.2)",
              borderRadius: 12,
              padding: "12px 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 11.5, color: "#4ade80", fontWeight: 600 }}>Model Status: Active</span>
            </div>
            <div style={{ fontSize: 11, color: "#475569" }}>v2.3.1 · 99.2% accuracy</div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Navbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  const NOTIFICATIONS = [
    { title: "Phishing URL blocked", desc: "secure-bank-login.xyz flagged as high risk", time: "2m ago", type: "danger" as const },
    { title: "Weekly report ready", desc: "Your scan summary for this week is available", time: "1h ago", type: "info" as const },
    { title: "Model updated", desc: "Detection model upgraded to v2.3.1", time: "3h ago", type: "success" as const },
  ];

  const dotColor = { danger: "#ef4444", info: "#3b82f6", success: "#22c55e" };

  useEffect(() => {
    const closeMenus = () => {
      setProfileOpen(false);
      setNotifOpen(false);
    };
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/url-scanner?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: 64,
        borderBottom: "1px solid rgba(255,255,255,.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "rgba(2,6,23,.85)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        <button
          type="button"
          onClick={onMenuClick}
          className="navbar-menu-btn"
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "none" }}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 10,
            padding: "8px 12px",
            maxWidth: 320,
            flex: 1,
          }}
        >
          <Search size={15} color="#475569" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scans, threats, reports..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: 13,
              fontFamily: "Inter, sans-serif",
            }}
          />
        </form>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
        <button
          type="button"
          onClick={toggle}
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            color: "#94a3b8",
            cursor: "pointer",
          }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              color: "#94a3b8",
              cursor: "pointer",
              position: "relative",
            }}
            aria-label="Notifications"
          >
            <Bell size={15} />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 7,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#ef4444",
                border: "1.5px solid #020617",
              }}
            />
          </button>

          {notifOpen ? (
            <div
              style={{
                position: "absolute",
                top: 42,
                right: 0,
                width: 320,
                background: "#0F172A",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 14,
                boxShadow: "0 12px 40px rgba(0,0,0,.5)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid rgba(255,255,255,.06)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#e2e8f0",
                }}
              >
                Notifications
              </div>
              {NOTIFICATIONS.map((n, i) => (
                <div
                  key={n.title}
                  style={{
                    padding: "12px 16px",
                    borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid rgba(255,255,255,.05)" : "none",
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: dotColor[n.type],
                      marginTop: 5,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: 12.5, color: "#e2e8f0", fontWeight: 500, marginBottom: 2 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748b", marginBottom: 3 }}>{n.desc}</div>
                    <div style={{ fontSize: 10.5, color: "#334155" }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div style={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px 5px 5px",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {initials}
            </div>
            <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{user?.name ?? "User"}</span>
            <ChevronDown size={13} color="#475569" />
          </button>

          {profileOpen ? (
            <div
              style={{
                position: "absolute",
                top: 46,
                right: 0,
                width: 200,
                background: "#0F172A",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 14,
                boxShadow: "0 12px 40px rgba(0,0,0,.5)",
                zIndex: 50,
                overflow: "hidden",
                padding: 6,
              }}
            >
              {[
                { icon: <UserCircle size={15} />, label: "View Profile", href: "/dashboard/profile" },
                { icon: <Key size={15} />, label: "API Keys", href: "/dashboard/profile" },
                { icon: <Settings size={15} />, label: "Settings", href: "/dashboard/settings" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setProfileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "9px 10px",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#cbd5e1",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ color: "#64748b" }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "5px 0" }} />
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 10px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#f87171",
                  background: "none",
                  border: "none",
                  width: "100%",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                <LogOut size={15} /> Log out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activePath = "/dashboard" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020617", fontFamily: "Inter, sans-serif" }}>
      <Sidebar activePath={activePath} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main style={{ flex: 1, padding: 24 }}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
