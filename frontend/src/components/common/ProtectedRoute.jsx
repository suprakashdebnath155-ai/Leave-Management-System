import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "./Loader";

const HOME_BY_ROLE = {
  admin: "/admin",
  employee: "/employee",
  reportingOfficer: "/reporting",
  reviewingOfficer: "/reviewing",
  approvingAuthority: "/approving",
};

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || "/login"} replace />;
  }
  return <Outlet />;
}

export { HOME_BY_ROLE };
