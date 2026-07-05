import { useEffect, useState } from "react";
import { FiCheckCircle, FiDownload, FiFileText, FiPrinter, FiXCircle } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { PageHeader, StatCard } from "../../components/common/Ui";
import { downloadCsv } from "../../utils/format";
import { getLeaveStatus } from "../../utils/leaveStatus";

export default function Reports() {
  const [report, setReport] = useState(null);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", department: "", leaveType: "" });
  const [error, setError] = useState("");
  const load = (activeFilters = filters) => {
    const params = Object.fromEntries(Object.entries(activeFilters).filter(([, value]) => value));
    api.get("/reports", { params })
      .then(({ data }) => setReport(data.report))
      .catch((err) => setError(err.userMessage));
  };
  useEffect(() => {
    api.get("/reports")
      .then(({ data }) => setReport(data.report))
      .catch((err) => setError(err.userMessage));
  }, []);
  if (!report) return <Loader label="Building leave report" />;
  const exportReport = () => downloadCsv("leave-report.csv", report.records.map((leave) => ({
    Employee: leave.employeeName,
    Department: leave.department,
    "Leave Type": leave.leaveType,
    From: leave.startDate,
    To: leave.endDate,
    Days: leave.daysRequested,
    Status: getLeaveStatus(leave),
  })));
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Reports & analytics"
        description="Generate date-range, department and leave-type reports."
        actions={<><button className="button secondary" onClick={() => window.print()}><FiPrinter /> Save PDF</button><button className="button primary" onClick={exportReport}><FiDownload /> Export Excel/CSV</button></>}
      />
      {error && <div className="form-alert error">{error}</div>}
      <section className="panel report-filters">
        <label className="field"><span>From</span><input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} /></label>
        <label className="field"><span>To</span><input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} /></label>
        <label className="field"><span>Department</span><select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}><option value="">All departments</option>{report.byDepartment.map((item) => <option key={item.department}>{item.department}</option>)}</select></label>
        <label className="field"><span>Leave type</span><select value={filters.leaveType} onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}><option value="">All leave types</option><option>Casual Leave</option><option>Medical Leave</option><option>Earned Leave</option><option>Half Pay Leave</option><option>Duty Leave</option></select></label>
        <button className="button primary" onClick={() => load()}>Generate</button>
      </section>
      <section className="stats-grid four">
        <StatCard label="Requests" value={report.totals.total} icon={<FiFileText />} tone="blue" />
        <StatCard label="Leave days" value={report.totals.days} icon={<FiFileText />} tone="purple" />
        <StatCard label="Approved" value={report.totals.approved} icon={<FiCheckCircle />} tone="green" />
        <StatCard label="Rejected" value={report.totals.rejected} icon={<FiXCircle />} tone="red" />
      </section>
      <section className="panel">
        <div className="panel-header"><div><p className="eyebrow">Department view</p><h2>Leave utilisation</h2></div></div>
        <div className="table-wrap">
          <table><thead><tr><th>Department</th><th>Employees</th><th>Requests</th><th>Approved days</th></tr></thead>
          <tbody>{report.byDepartment.map((item) => <tr key={item.department}><td><strong>{item.department}</strong></td><td>{item.employees}</td><td>{item.requests}</td><td>{item.approvedDays}</td></tr>)}</tbody></table>
        </div>
      </section>
    </>
  );
}
