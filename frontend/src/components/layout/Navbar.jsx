import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiBell, FiLogOut, FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

const titles = {
  "/employee": "My workspace",
  "/employee/apply": "Apply for leave",
  "/employee/history": "Leave history",
  "/admin": "Administration",
  "/admin/employees": "Employee directory",
  "/admin/leaves": "Leave records",
  "/admin/reports": "Reports & analytics",
  "/admin/holidays": "Holiday calendar",
  "/reporting": "Reporting officer desk",
  "/reviewing": "Reviewing officer desk",
  "/approving": "Approving authority desk",
  "/profile": "My profile",
  "/notifications": "Notifications",
};

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    api.get("/notifications/my")
      .then(({ data }) =>
        setUnread(data.notifications.filter((notification) => !notification.isRead).length)
      )
      .catch(() => {});
  }, [location.pathname]);

  const initials = (user?.name || "User")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-title">
        <button className="menu-button" onClick={onMenu} aria-label="Open menu"><FiMenu /></button>
        <div>
          <small>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</small>
          <strong>{titles[location.pathname] || "LeaveFlow"}</strong>
        </div>
      </div>
      <div className="navbar-actions">
        <button className="icon-button" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
          {dark ? <FiSun /> : <FiMoon />}
        </button>
        <Link className="icon-button notification-button" to="/notifications" aria-label="Notifications">
          <FiBell />
          {unread > 0 && <span>{unread > 9 ? "9+" : unread}</span>}
        </Link>
        <Link className="user-chip" to="/profile">
          <span className="avatar">{user?.photoURL ? <img src={user.photoURL} alt="" /> : initials}</span>
          <span>
            <strong>{user?.name}</strong>
            <small>{user?.designation || user?.role?.replace(/([A-Z])/g, " $1")}</small>
          </span>
        </Link>
        <button className="icon-button logout-button" onClick={logout} aria-label="Sign out"><FiLogOut /></button>
      </div>
    </header>
  );
}
