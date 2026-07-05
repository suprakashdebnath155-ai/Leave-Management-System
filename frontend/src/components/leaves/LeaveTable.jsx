import { FiExternalLink, FiEye } from "react-icons/fi";
import StatusBadge from "../common/StatusBadge";
import { getLeaveStatus } from "../../utils/leaveStatus";
import { formatDate } from "../../utils/format";
import { EmptyState } from "../common/Ui";

export default function LeaveTable({ leaves, onView, actions = true, showEmployee = false }) {
  if (!leaves.length) {
    return <EmptyState title="Nothing to show" description="No leave requests match the current view." />;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {showEmployee && <th>Employee</th>}
            <th>Leave type</th><th>Duration</th><th>Days</th><th>Status</th>
            {actions && <th />}
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              {showEmployee && <td><strong>{leave.employeeName || "Employee"}</strong><small>{leave.employeeCode || leave.department}</small></td>}
              <td><strong>{leave.leaveType}</strong><small>{leave.emergency ? "Emergency request" : leave.halfDay ? "Half day" : leave.department}</small></td>
              <td>{formatDate(leave.startDate)}<small>to {formatDate(leave.endDate)}</small></td>
              <td>{leave.daysRequested}</td>
              <td><StatusBadge status={getLeaveStatus(leave)} /></td>
              {actions && (
                <td className="table-actions">
                  {leave.attachmentUrl && <a className="icon-button small" href={leave.attachmentUrl} target="_blank" rel="noreferrer" title="Attachment"><FiExternalLink /></a>}
                  <button className="icon-button small" onClick={() => onView(leave)} title="View details"><FiEye /></button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
