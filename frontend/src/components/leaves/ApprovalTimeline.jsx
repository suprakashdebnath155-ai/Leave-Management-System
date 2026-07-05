import { FiCheck, FiClock, FiX } from "react-icons/fi";
import { formatDate } from "../../utils/format";

const steps = [
  ["reporting", "Reporting Officer"],
  ["reviewing", "Reviewing Officer"],
  ["approving", "Approving Authority"],
];

export default function ApprovalTimeline({ leave }) {
  if (leave.status === "cancelled") {
    return <div className="cancelled-timeline"><FiX /> Cancelled on {formatDate(leave.cancelledAt)}</div>;
  }
  return (
    <div className="approval-timeline">
      <div className="timeline-step done">
        <span><FiCheck /></span>
        <div><strong>Request submitted</strong><small>{formatDate(leave.createdAt)}</small></div>
      </div>
      {steps.map(([key, label], index) => {
        const status = leave[`${key}Status`] || "pending";
        const pending = status === "pending";
        const blocked = steps.slice(0, index).some(
          ([previousKey]) =>
            !["recommended", "approved"].includes(
              leave[`${previousKey}Status`] || "pending"
            )
        );
        const className = blocked
          ? "waiting"
          : pending
            ? "current"
            : status === "rejected"
              ? "rejected"
              : "done";
        return (
          <div className={`timeline-step ${className}`} key={key}>
            <span>{className === "done" ? <FiCheck /> : className === "rejected" ? <FiX /> : <FiClock />}</span>
            <div>
              <strong>{label}</strong>
              <small>{status === "pending" ? (className === "waiting" ? "Waiting for previous stage" : "Pending action") : status}</small>
              {leave[`${key}Remark`] && <p>“{leave[`${key}Remark`]}”</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
