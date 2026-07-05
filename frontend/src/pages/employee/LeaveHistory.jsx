import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiFilter, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import LeaveTable from "../../components/leaves/LeaveTable";
import ApprovalTimeline from "../../components/leaves/ApprovalTimeline";
import { ErrorState, Modal, PageHeader } from "../../components/common/Ui";
import StatusBadge from "../../components/common/StatusBadge";
import { getLeaveStatus } from "../../utils/leaveStatus";
import { formatDate } from "../../utils/format";

export default function LeaveHistory() {
  const location = useLocation();
  const [leaves, setLeaves] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.message || "");

  const load = useCallback(() => {
    api.get("/leaves/my-leaves")
      .then(({ data }) => setLeaves(data.leaves))
      .catch((err) => setError(err.userMessage));
  }, []);
  useEffect(load, [load]);

  const filtered = useMemo(() => {
    if (!leaves) return [];
    const result = status === "all"
      ? [...leaves]
      : leaves.filter((leave) => getLeaveStatus(leave).includes(status));
    if (sort === "oldest") result.reverse();
    return result;
  }, [leaves, status, sort]);

  const cancel = async () => {
    if (!window.confirm("Cancel this leave request? This cannot be undone.")) return;
    try {
      await api.patch(`/leaves/${selected.id}/cancel`);
      setSelected(null);
      setNotice("Leave request cancelled.");
      load();
    } catch (err) {
      setError(err.userMessage);
    }
  };

  if (error && !leaves) return <ErrorState message={error} retry={load} />;
  if (!leaves) return <Loader label="Loading leave history" />;

  return (
    <>
      <PageHeader
        eyebrow="Your records"
        title="Leave history"
        description="Track every request and see exactly where it sits in the approval chain."
      />
      {notice && <div className="form-alert success dismissible">{notice}<button onClick={() => setNotice("")}>×</button></div>}
      {error && <div className="form-alert error">{error}</div>}
      <section className="panel">
        <div className="filter-bar">
          <span><FiFilter /> Filter</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <small>{filtered.length} requests</small>
        </div>
        <LeaveTable leaves={filtered} onView={setSelected} />
      </section>
      {selected && (
        <Modal
          title="Leave request details"
          onClose={() => setSelected(null)}
          footer={
            !["cancelled", "rejected"].includes(selected.status) &&
            <button className="button danger" onClick={cancel}><FiTrash2 /> Cancel request</button>
          }
        >
          <div className="detail-hero">
            <div><p className="eyebrow">Request {selected.id.slice(0, 7).toUpperCase()}</p><h3>{selected.leaveType}</h3><p>{formatDate(selected.startDate)} — {formatDate(selected.endDate)} · {selected.daysRequested} day(s)</p></div>
            <StatusBadge status={getLeaveStatus(selected)} />
          </div>
          <div className="detail-block"><small>Reason</small><p>{selected.reason}</p></div>
          <h3 className="subheading">Approval journey</h3>
          <ApprovalTimeline leave={selected} />
        </Modal>
      )}
    </>
  );
}
