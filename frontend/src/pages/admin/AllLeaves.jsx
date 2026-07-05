import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import LeaveTable from "../../components/leaves/LeaveTable";
import ApprovalTimeline from "../../components/leaves/ApprovalTimeline";
import { Modal, PageHeader } from "../../components/common/Ui";
import { downloadCsv, formatDate } from "../../utils/format";
import { getLeaveStatus } from "../../utils/leaveStatus";

export default function AllLeaves() {
  const [leaves, setLeaves] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "", type: "", department: "" });
  const [error, setError] = useState("");
  useEffect(() => {
    api.get("/leaves/all")
      .then(({ data }) => setLeaves(data.leaves))
      .catch((err) => setError(err.userMessage));
  }, []);

  const filtered = useMemo(() => {
    if (!leaves) return [];
    const term = filters.search.toLowerCase();
    return leaves.filter((leave) =>
      (!term || [leave.employeeName, leave.employeeCode].filter(Boolean).some((value) => value.toLowerCase().includes(term))) &&
      (!filters.status || getLeaveStatus(leave).includes(filters.status)) &&
      (!filters.type || leave.leaveType === filters.type) &&
      (!filters.department || leave.department === filters.department)
    );
  }, [leaves, filters]);
  if (!leaves) return <Loader label="Loading leave records" />;
  const departments = [...new Set(leaves.map((leave) => leave.department).filter(Boolean))];
  const types = [...new Set(leaves.map((leave) => leave.leaveType).filter(Boolean))];
  const exportRecords = () => downloadCsv("leave-records.csv", filtered.map((leave) => ({
    Employee: leave.employeeName,
    "Employee ID": leave.employeeCode,
    Department: leave.department,
    "Leave Type": leave.leaveType,
    From: leave.startDate,
    To: leave.endDate,
    Days: leave.daysRequested,
    Status: getLeaveStatus(leave),
    Reason: leave.reason,
  })));
  return (
    <>
      <PageHeader
        eyebrow="Audit-ready records"
        title="All leave requests"
        description="Search and filter every application across the organisation."
        actions={<button className="button secondary" onClick={exportRecords}><FiDownload /> Export CSV</button>}
      />
      {error && <div className="form-alert error">{error}</div>}
      <section className="panel">
        <div className="filter-bar multi">
          <label className="search-box"><FiSearch /><input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Employee name or ID" /></label>
          <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}><option value="">All departments</option>{departments.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}><option value="">All leave types</option>{types.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option></select>
          <small>{filtered.length} records</small>
        </div>
        <LeaveTable leaves={filtered} onView={setSelected} showEmployee />
      </section>
      {selected && (
        <Modal title="Leave record" onClose={() => setSelected(null)}>
          <div className="detail-hero"><div><p className="eyebrow">{selected.employeeCode}</p><h3>{selected.employeeName}</h3><p>{selected.department} · {selected.designation}</p></div></div>
          <div className="request-facts">
            <div><small>Leave type</small><strong>{selected.leaveType}</strong></div>
            <div><small>Dates</small><strong>{formatDate(selected.startDate)} — {formatDate(selected.endDate)}</strong></div>
            <div><small>Days</small><strong>{selected.daysRequested}</strong></div>
            <div><small>Applied</small><strong>{formatDate(selected.createdAt)}</strong></div>
          </div>
          <div className="detail-block"><small>Reason</small><p>{selected.reason}</p></div>
          <h3 className="subheading">Approval history</h3>
          <ApprovalTimeline leave={selected} />
        </Modal>
      )}
    </>
  );
}
