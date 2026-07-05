import { useCallback, useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiFileText, FiThumbsUp, FiXCircle } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import LeaveTable from "../../components/leaves/LeaveTable";
import ApprovalTimeline from "../../components/leaves/ApprovalTimeline";
import { ErrorState, Modal, PageHeader, StatCard } from "../../components/common/Ui";
import StatusBadge from "../../components/common/StatusBadge";
import { getLeaveStatus } from "../../utils/leaveStatus";
import { formatDate } from "../../utils/format";

const config = {
  reporting: {
    eyebrow: "First-level review",
    title: "Reporting Officer desk",
    description: "Review employee context and recommend suitable requests for the next stage.",
    approveLabel: "Recommend",
  },
  reviewing: {
    eyebrow: "Second-level review",
    title: "Reviewing Officer desk",
    description: "Validate recommendations and forward eligible requests for final approval.",
    approveLabel: "Recommend onward",
  },
  approving: {
    eyebrow: "Final decision",
    title: "Approving Authority desk",
    description: "Make the final decision with the full approval history and employee context.",
    approveLabel: "Approve leave",
  },
};

export default function OfficerDashboard({ stage }) {
  const copy = config[stage];
  const [dashboard, setDashboard] = useState(null);
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    api.get(`/dashboard/${stage}`)
      .then(({ data }) => setDashboard(data.dashboard))
      .catch((err) => setError(err.userMessage));
  }, [stage]);
  useEffect(load, [load]);

  const decide = async (approved) => {
    setSubmitting(true);
    setError("");
    try {
      await api.put(`/leaves/${stage}/${selected.id}/review`, {
        decision: approved ? (stage === "approving" ? "approved" : "recommended") : "rejected",
        remark,
      });
      setSelected(null);
      setRemark("");
      setNotice(`Decision recorded for ${selected.employeeName || "the employee"}.`);
      load();
    } catch (err) {
      setError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !dashboard) return <ErrorState message={error} retry={load} />;
  if (!dashboard) return <Loader label="Loading approval queue" />;
  const { summary, pending, recentReviews } = dashboard;
  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
      {notice && <div className="form-alert success dismissible">{notice}<button onClick={() => setNotice("")}>×</button></div>}
      {error && <div className="form-alert error">{error}</div>}
      <section className="stats-grid four">
        <StatCard label="Awaiting review" value={summary.pending} icon={<FiClock />} tone="amber" />
        <StatCard label="Reviewed" value={summary.reviewed} icon={<FiFileText />} tone="blue" />
        <StatCard label={stage === "approving" ? "Approved" : "Recommended"} value={summary.recommended} icon={<FiCheckCircle />} tone="green" />
        <StatCard label="Rejected" value={summary.rejected} icon={<FiXCircle />} tone="red" />
      </section>
      <section className="panel">
        <div className="panel-header"><div><p className="eyebrow">Action queue</p><h2>Requests awaiting you</h2></div><span className="count-pill">{pending.length}</span></div>
        <LeaveTable leaves={pending} onView={setSelected} showEmployee />
      </section>
      {recentReviews.length > 0 && (
        <section className="panel subdued-panel">
          <div className="panel-header"><div><p className="eyebrow">Audit trail</p><h2>Recently reviewed</h2></div></div>
          <LeaveTable leaves={recentReviews} onView={setSelected} showEmployee />
        </section>
      )}
      {selected && (
        <Modal
          title="Review leave request"
          onClose={() => !submitting && setSelected(null)}
          footer={
            <div className="decision-actions">
              <button className="button danger" onClick={() => decide(false)} disabled={submitting}><FiXCircle /> Reject</button>
              <button className="button primary" onClick={() => decide(true)} disabled={submitting}><FiThumbsUp /> {copy.approveLabel}</button>
            </div>
          }
        >
          <div className="detail-hero">
            <div><p className="eyebrow">{selected.employeeCode || selected.department}</p><h3>{selected.employeeName || "Employee"}</h3><p>{selected.designation || selected.department}</p></div>
            <StatusBadge status={getLeaveStatus(selected)} />
          </div>
          <div className="request-facts">
            <div><small>Leave type</small><strong>{selected.leaveType}</strong></div>
            <div><small>Duration</small><strong>{formatDate(selected.startDate)} — {formatDate(selected.endDate)}</strong></div>
            <div><small>Working days</small><strong>{selected.daysRequested}</strong></div>
            <div><small>Request type</small><strong>{selected.emergency ? "Emergency" : selected.halfDay ? "Half day" : "Standard"}</strong></div>
          </div>
          <div className="detail-block"><small>Employee’s reason</small><p>{selected.reason}</p></div>
          <h3 className="subheading">Approval history</h3>
          <ApprovalTimeline leave={selected} />
          <label className="field remark-field"><span>Your remarks</span><textarea rows="3" maxLength="500" value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Add a clear note for the employee and next approver…" /></label>
        </Modal>
      )}
    </>
  );
}
