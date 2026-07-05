import { NavLink } from "react-router-dom";
import {
  FiCalendar,
  FiChevronLeft,
  FiClock,
  FiFileText,
  FiGrid,
  FiHome,
  FiPieChart,
  FiPlusCircle,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const navigation = {
  employee: [
    { to: "/employee", label: "Overview", icon: FiHome, end: true },
    { to: "/employee/apply", label: "Apply leave", icon: FiPlusCircle },
    { to: "/employee/history", label: "Leave history", icon: FiClock },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: FiGrid, end: true },
    { to: "/admin/employees", label: "Employees", icon: FiUsers },
    { to: "/admin/leaves", label: "Leave records", icon: FiFileText },
    { to: "/admin/reports", label: "Reports", icon: FiPieChart },
    { to: "/admin/holidays", label: "Holidays", icon: FiCalendar },
  ],
  reportingOfficer: [
    { to: "/reporting", label: "Requests", icon: FiFileText, end: true },
  ],
  reviewingOfficer: [
    { to: "/reviewing", label: "Requests", icon: FiFileText, end: true },
  ],
  approvingAuthority: [
    { to: "/approving", label: "Final approvals", icon: FiFileText, end: true },
  ],
};

export default function Sidebar({ mobileOpen, collapsed, onClose, onCollapse }) {
  const { user } = useAuth();
  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="brand">
        <span className="brand-mark">L</span>
        <div className="brand-copy">
          <strong>LeaveFlow</strong>
          <small>People operations</small>
        </div>
        <button className="mobile-close" onClick={onClose} aria-label="Close menu">
          <FiX />
        </button>
      </div>
      <div className="sidebar-label">Workspace</div>
      <nav>
        {(navigation[user?.role] || []).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="support-card">
          <span>Need a hand?</span>
          <small>Contact your HR administrator for policy questions.</small>
        </div>
        <button className="collapse-button" onClick={onCollapse}>
          <FiChevronLeft />
          <span>{collapsed ? "Expand" : "Collapse"}</span>
        </button>
      </div>
    </aside>
  );
}
