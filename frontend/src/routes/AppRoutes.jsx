import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute, { HOME_BY_ROLE } from "../components/common/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import ApplyLeave from "../pages/employee/ApplyLeave";
import LeaveHistory from "../pages/employee/LeaveHistory";
import Profile from "../pages/shared/Profile";
import Notifications from "../pages/shared/Notifications";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EmployeeManagement from "../pages/admin/EmployeeManagement";
import AllLeaves from "../pages/admin/AllLeaves";
import Reports from "../pages/admin/Reports";
import Holidays from "../pages/admin/Holidays";
import ReportingDashboard from "../pages/reportingOfficer/ReportingDashboard";
import ReviewingDashboard from "../pages/reviewingOfficer/ReviewingDashboard";
import ApprovingDashboard from "../pages/approvingAuthority/ApprovingDashboard";
import NotFound from "../pages/shared/NotFound";
import { useAuth } from "../hooks/useAuth";
import ResetPassword from "../pages/auth/ResetPassword";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={HOME_BY_ROLE[user?.role] || "/login"} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
     <Routes>
    <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<HomeRedirect />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route element={<ProtectedRoute roles={["employee"]} />}>
              <Route path="employee" element={<EmployeeDashboard />} />
              <Route path="employee/apply" element={<ApplyLeave />} />
              <Route path="employee/history" element={<LeaveHistory />} />
              
            </Route>
              <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/employees" element={<EmployeeManagement />} />
              <Route path="admin/leaves" element={<AllLeaves />} />
              <Route path="admin/reports" element={<Reports />} />
              <Route path="admin/holidays" element={<Holidays />} />
            </Route>
            <Route element={<ProtectedRoute roles={["reportingOfficer"]} />}>
              <Route path="reporting" element={<ReportingDashboard />} />
            </Route>
            <Route element={<ProtectedRoute roles={["reviewingOfficer"]} />}>
              <Route path="reviewing" element={<ReviewingDashboard />} />
            </Route>
            <Route element={<ProtectedRoute roles={["approvingAuthority"]} />}>
              <Route path="approving" element={<ApprovingDashboard />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
