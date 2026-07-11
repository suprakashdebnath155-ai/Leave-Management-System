import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiPlus,
  FiUsers,
  FiXCircle,
  FiTrash2,
} from "react-icons/fi";

import api from "../../services/api";
import Loader from "../../components/common/Loader";
import LeaveTable from "../../components/leaves/LeaveTable";
import {
  ErrorState,
  PageHeader,
  StatCard,
} from "../../components/common/Ui";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [clearingLeaves, setClearingLeaves] = useState(false);

  const load = useCallback(async () => {
  try {
    setError("");

    const { data } = await api.get("/dashboard/admin");

    setDashboard(data.dashboard);
  } catch (err) {
    setError(
      err.userMessage ||
      err.message ||
      "Unable to load the admin dashboard."
    );
  }
}, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleClearAllLeaves = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete ALL leave requests? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setClearingLeaves(true);

      const { data } = await api.delete("/leaves/admin/clear-all");

      alert(data.message);

      await load();
    } catch (err) {
      console.error("Failed to clear all leave requests:", err);

      alert(
        err.userMessage ||
          err.response?.data?.message ||
          "Failed to clear all leave requests."
      );
    } finally {
      setClearingLeaves(false);
    }
  };

  if (error) {
    return <ErrorState message={error} retry={load} />;
  }

  if (!dashboard) {
    return <Loader label="Preparing administration dashboard" />;
  }

  const { summary, byDepartment, recentLeaves } = dashboard;

  const max = Math.max(
    1,
    ...byDepartment.map((item) => item.employees)
  );

  return (
    <>
      <PageHeader
        eyebrow="Organisation overview"
        title="People & leave at a glance"
        description="A live operational view across your workforce."
        actions={
          <Link className="button primary" to="/admin/employees">
            <FiPlus />
            Add employee
          </Link>
        }
      />

      <section className="stats-grid six">
        <StatCard
          label="Employees"
          value={summary.totalEmployees}
          icon={<FiUsers />}
          tone="blue"
          hint={`${summary.activeEmployees} active`}
        />

        <StatCard
          label="Departments"
          value={summary.totalDepartments}
          icon={<FiUsers />}
          tone="purple"
        />

        <StatCard
          label="Requests"
          value={summary.totalLeaves}
          icon={<FiFileText />}
          tone="slate"
        />

        <StatCard
          label="Pending"
          value={summary.pending}
          icon={<FiClock />}
          tone="amber"
        />

        <StatCard
          label="Approved"
          value={summary.approved}
          icon={<FiCheckCircle />}
          tone="green"
        />

        <StatCard
          label="Rejected"
          value={summary.rejected}
          icon={<FiXCircle />}
          tone="red"
        />
      </section>

      <section className="content-grid half">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Workforce mix</p>
              <h2>Employees by department</h2>
            </div>
          </div>

          <div className="bar-list">
            {byDepartment.map((item) => (
              <div key={item.department}>
                <span>
                  <strong>{item.department}</strong>
                  <small>{item.employees} employees</small>
                </span>

                <span className="bar-track">
                  <i
                    style={{
                      width: `${(item.employees / max) * 100}%`,
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Demand</p>
              <h2>Requests by department</h2>
            </div>
          </div>

          <div className="department-list">
            {byDepartment.map((item) => (
              <div key={item.department}>
                <span className="department-avatar">
                  {item.department.slice(0, 2).toUpperCase()}
                </span>

                <strong>{item.department}</strong>

                <span>{item.leaves} requests</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Across the organisation</p>
            <h2>Recent leave requests</h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <Link className="text-link" to="/admin/leaves">
              View records
            </Link>

            <button
              type="button"
              className="button danger"
              onClick={handleClearAllLeaves}
              disabled={clearingLeaves}
            >
              <FiTrash2 />
              {clearingLeaves ? "Clearing..." : "Clear All"}
            </button>
          </div>
        </div>

        <LeaveTable
          leaves={recentLeaves}
          showEmployee
          actions={false}
        />
      </section>
    </>
  );
}