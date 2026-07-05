import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiPlus,
  FiXCircle,
} from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import { getLeaveStatus } from "../../utils/leaveStatus";
import { EmptyState, ErrorState, PageHeader, StatCard } from "../../components/common/Ui";
import { formatDate } from "../../utils/format";

const balanceItems = [
  ["Casual", "casualLeaveBalance", "CL"],
  ["Medical", "medicalLeave", "ML"],
  ["Earned", "earnedLeave", "EL"],
  ["Half pay", "halfPayLeave", "HPL"],
  ["Duty", "dutyLeave", "DL"],
];

export default function EmployeeDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const load = useCallback(() => {
    api.get("/dashboard/employee")
      .then(({ data }) => setDashboard(data.dashboard))
      .catch((err) => setError(err.userMessage));
  }, []);

  useEffect(load, [load]);
  if (error) return <ErrorState message={error} retry={load} />;
  if (!dashboard) return <Loader label="Preparing your dashboard" />;

  const { profile, leaveBalance, summary, recentLeaves, upcomingHolidays } = dashboard;
  const firstName = profile.name?.split(" ")[0] || "there";

  return (
    <>
      <PageHeader
        eyebrow="Employee workspace"
        title={`Good to see you, ${firstName}.`}
        description="Here’s a clear view of your time off and what’s moving through approval."
        actions={<Link className="button primary" to="/employee/apply"><FiPlus /> Apply leave</Link>}
      />
      <section className="stats-grid four">
        <StatCard label="Total requests" value={summary.totalApplied} icon={<FiFileText />} tone="blue" />
        <StatCard label="Awaiting action" value={summary.pending} icon={<FiClock />} tone="amber" />
        <StatCard label="Approved" value={summary.approved} icon={<FiCheckCircle />} tone="green" />
        <StatCard label="Rejected" value={summary.rejected} icon={<FiXCircle />} tone="red" />
      </section>
      <section className="balance-section">
        <div className="section-heading">
          <div><p className="eyebrow">Available now</p><h2>Leave balances</h2></div>
          <small>Balances update automatically after final approval.</small>
        </div>
        <div className="balance-grid">
          {balanceItems.map(([label, key, code], index) => (
            <article className={`balance-card balance-${index + 1}`} key={key}>
              <span>{code}</span>
              <strong>{leaveBalance[key] ?? 0}</strong>
              <p>{label} leave</p>
              <small>days available</small>
            </article>
          ))}
        </div>
      </section>
      <section className="content-grid two-thirds">
        <article className="panel">
          <div className="panel-header">
            <div><p className="eyebrow">Latest activity</p><h2>Recent requests</h2></div>
            <Link className="text-link" to="/employee/history">View all <FiArrowRight /></Link>
          </div>
          {recentLeaves.length ? (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Leave</th><th>Dates</th><th>Days</th><th>Status</th></tr></thead>
                <tbody>
                  {recentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td><strong>{leave.leaveType}</strong><small>{leave.emergency ? "Emergency" : leave.reason}</small></td>
                      <td>{formatDate(leave.startDate)}<small>to {formatDate(leave.endDate)}</small></td>
                      <td>{leave.daysRequested}</td>
                      <td><StatusBadge status={getLeaveStatus(leave)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No leave requests yet" description="Your submitted requests will appear here." action={<Link className="button secondary" to="/employee/apply">Apply now</Link>} />
          )}
        </article>
        <article className="panel">
          <div className="panel-header">
            <div><p className="eyebrow">Plan ahead</p><h2>Upcoming holidays</h2></div>
            <FiCalendar />
          </div>
          <div className="holiday-list">
            {upcomingHolidays.length ? upcomingHolidays.map((holiday) => (
              <div key={holiday.id}>
                <span className="date-tile">
                  <strong>{new Date(`${holiday.date}T00:00:00`).getDate()}</strong>
                  <small>{new Date(`${holiday.date}T00:00:00`).toLocaleDateString("en-IN", { month: "short" })}</small>
                </span>
                <div><strong>{holiday.name}</strong><small>{formatDate(holiday.date, { weekday: "long" })}</small></div>
              </div>
            )) : <p className="muted">No upcoming holidays have been added.</p>}
          </div>
        </article>
      </section>
    </>
  );
}
