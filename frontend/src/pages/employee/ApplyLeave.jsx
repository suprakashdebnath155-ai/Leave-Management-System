import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiCalendar, FiCheck, FiPaperclip } from "react-icons/fi";
import api from "../../services/api";
import { PageHeader } from "../../components/common/Ui";

const leaveTypes = [
  ["Casual Leave", "casualLeaveBalance"],
  ["Medical Leave", "medicalLeave"],
  ["Earned Leave", "earnedLeave"],
  ["Half Pay Leave", "halfPayLeave"],
  ["Duty Leave", "dutyLeave"],
];

const today = new Date().toISOString().slice(0, 10);

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
    halfDay: false,
    emergency: false,
    attachmentUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/leaves/balance"), api.get("/holidays")])
  .then(([balanceResponse, holidayResponse]) => {
    

    setBalance(balanceResponse.data.balance);

    setHolidays(holidayResponse.data.holidays || []);
  })
      .catch((err) => setError(err.userMessage));
  }, []);

  const estimatedDays = useMemo(() => {
    if (!form.startDate || !form.endDate || form.endDate < form.startDate) return 0;
    if (form.halfDay) return 0.5;
    const holidaySet = new Set(holidays.map((holiday) => holiday.date));
    let count = 0;
    const cursor = new Date(`${form.startDate}T00:00:00`);
    const end = new Date(`${form.endDate}T00:00:00`);
    while (cursor <= end) {
      const date = cursor.toISOString().slice(0, 10);
      if (![0, 6].includes(cursor.getDay()) && !holidaySet.has(date)) count += 1;
      cursor.setDate(cursor.getDate() + 1);
    }
    return count;
  }, [form.startDate, form.endDate, form.halfDay, holidays]);

  const balanceKey = leaveTypes.find(([name]) => name === form.leaveType)?.[1];
  const available = Number(balance[balanceKey] || 0);


  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (estimatedDays <= 0) return setError("Choose at least one working day.");
    if (estimatedDays > available) return setError("The request exceeds your available balance.");
    setSubmitting(true);
    try {
      await api.post("/leaves/apply", form);
      navigate("/employee/history", { state: { message: "Leave request submitted successfully." } });
    } catch (err) {
      setError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="New request"
        title="Plan your time away"
        description="Weekends and published holidays are excluded automatically."
      />
      <form className="form-layout" onSubmit={submit}>
        <section className="panel form-panel">
          {error && <div className="form-alert error"><FiAlertTriangle /> {error}</div>}
          <div className="form-section">
            <div className="form-section-title"><span>1</span><div><h2>Leave details</h2><p>Choose the category and dates.</p></div></div>
            <div className="form-grid two">
              <label className="field">
                <span>Leave type</span>
               <select
  value={form.leaveType}
  onChange={(e) =>
    setForm({ ...form, leaveType: e.target.value })
  }
>
{leaveTypes.map(([name]) => (
  <option key={name} value={name}>
    {name}
  </option>
))}
</select>
              </label>
              <div className="balance-inline"><small>Available balance</small><strong>{available} days</strong></div>
              <label className="field">
                <span>Start date</span>
                <input type="date" min={form.emergency ? undefined : today} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value, endDate: form.halfDay ? e.target.value : form.endDate })} required />
              </label>
              <label className="field">
                <span>End date</span>
                <input type="date" min={form.startDate || today} value={form.endDate} disabled={form.halfDay} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </label>
            </div>
            <div className="check-row">
              <label className="check-card">
                <input type="checkbox" checked={form.halfDay} onChange={(e) => setForm({ ...form, halfDay: e.target.checked, endDate: e.target.checked ? form.startDate : form.endDate })} />
                <span><strong>Half day</strong><small>Counts as 0.5 day; one date only.</small></span>
              </label>
              <label className="check-card emergency">
                <input type="checkbox" checked={form.emergency} onChange={(e) => setForm({ ...form, emergency: e.target.checked })} />
                <span><strong>Emergency request</strong><small>Allows a past start date for exceptional cases.</small></span>
              </label>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-title"><span>2</span><div><h2>Context</h2><p>Help your approvers understand the request.</p></div></div>
            <label className="field">
              <span>Reason</span>
              <textarea rows="5" maxLength="500" minLength="10" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Briefly explain why you need this leave…" required />
              <small>{form.reason.length}/500 characters</small>
            </label>
            <label className="field">
              <span>Supporting document link <em>optional</em></span>
              <span className="input-with-icon"><FiPaperclip /><input type="url" value={form.attachmentUrl} onChange={(e) => setForm({ ...form, attachmentUrl: e.target.value })} placeholder="https://drive.example/document" /></span>
              <small>Use a secure link accessible to your approvers.</small>
            </label>
          </div>
        </section>
        <aside className="panel request-summary">
          <p className="eyebrow">Request summary</p>
          <h2>{form.leaveType}</h2>
          <div className="summary-days"><FiCalendar /><strong>{estimatedDays}</strong><span>working {estimatedDays === 1 ? "day" : "days"}</span></div>
          <dl>
            <div><dt>From</dt><dd>{form.startDate || "Not selected"}</dd></div>
            <div><dt>To</dt><dd>{form.endDate || "Not selected"}</dd></div>
            <div><dt>Balance after approval</dt><dd>{Math.max(0, available - estimatedDays)} days</dd></div>
          </dl>
          <div className="policy-note"><FiCheck /><p>Dates will be checked for overlaps, holidays and weekends before submission.</p></div>
          <button className="button primary wide" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for approval"}
          </button>
        </aside>
      </form>
    </>
  );
}
