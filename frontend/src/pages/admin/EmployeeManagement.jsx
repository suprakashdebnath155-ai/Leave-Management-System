import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiKey, FiPlus, FiPower, FiSearch, FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { EmptyState, Modal, PageHeader } from "../../components/common/Ui";
import { formatRole } from "../../utils/format";

const emptyForm = {
  name: "", email: "", employeeId: "", role: "employee", department: "",
  designation: "", jobMode: "Regular", dateOfJoining: "",
  reportingOfficerId: "", reviewingOfficerId: "", approvingAuthorityId: "",
};

export default function EmployeeManagement() {
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    api.get("/users")
      .then(({ data }) => setUsers(data.users))
      .catch((err) => setError(err.userMessage));
  }, []);
  useEffect(load, [load]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const term = search.toLowerCase();
    return users.filter((user) =>
      (!role || user.role === role) &&
      [user.name, user.email, user.employeeId, user.department]
        .filter(Boolean).some((value) => value.toLowerCase().includes(term))
    );
  }, [users, search, role]);

  const openCreate = () => { setForm(emptyForm); setModal("create"); setError(""); };
  const openEdit = (user) => { setForm({ ...emptyForm, ...user }); setModal("edit"); setError(""); };

  const save = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = modal === "create"
        ? await api.post("/auth/create-employee", form)
        : await api.patch(`/users/${form.id}`, form);
      setNotice(
        modal === "create" && response.data.temporaryPassword
          ? `Employee created. Temporary password: ${response.data.temporaryPassword}`
          : response.data.message
      );
      setModal(null);
      load();
    } catch (err) {
      setError(err.userMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (user) => {
    await api.patch(`/users/${user.id}/status`, { isActive: user.isActive === false });
    setNotice(`Account ${user.isActive === false ? "activated" : "deactivated"}.`);
    load();
  };
  const resetPassword = async (user) => {
    if (!window.confirm(`Generate a password reset link for ${user.name}?`)) return;
    const { data } = await api.post(`/users/${user.id}/reset-password`);
    setNotice(data.resetLink ? `Reset link: ${data.resetLink}` : data.message);
  };
  const remove = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}? Their historical leave records will remain for audit purposes.`)) return;
    await api.delete(`/users/${user.id}`);
    setNotice("Employee deleted.");
    load();
  };

  if (!users) return <Loader label="Loading employee directory" />;
  const officers = {
    reportingOfficer: users.filter((user) => user.role === "reportingOfficer"),
    reviewingOfficer: users.filter((user) => user.role === "reviewingOfficer"),
    approvingAuthority: users.filter((user) => user.role === "approvingAuthority"),
  };
  return (
    <>
      <PageHeader
        eyebrow="People"
        title="Employee directory"
        description="Create accounts, assign approval chains and manage access."
        actions={<button className="button primary" onClick={openCreate}><FiPlus /> Add employee</button>}
      />
      {notice && <div className="form-alert success dismissible">{notice}<button onClick={() => setNotice("")}>×</button></div>}
      {error && !modal && <div className="form-alert error">{error}</div>}
      <section className="panel">
        <div className="filter-bar">
          <label className="search-box"><FiSearch /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, ID or department" /></label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            <option value="employee">Employee</option>
            <option value="reportingOfficer">Reporting Officer</option>
            <option value="reviewingOfficer">Reviewing Officer</option>
            <option value="approvingAuthority">Approving Authority</option>
            <option value="admin">Admin</option>
          </select>
          <small>{filtered.length} people</small>
        </div>
        {filtered.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Status</th><th /></tr></thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td><span className="employee-cell"><span className="avatar small">{user.name?.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><span><strong>{user.name}</strong><small>{user.email} · {user.employeeId || "No ID"}</small></span></span></td>
                    <td>{user.department || "—"}<small>{user.designation || user.jobMode}</small></td>
                    <td>{formatRole(user.role)}</td>
                    <td><span className={`status-badge ${user.isActive === false ? "neutral" : "success"}`}>{user.isActive === false ? "Inactive" : "Active"}</span></td>
                    <td className="table-actions">
                      <button className="icon-button small" title="Edit" onClick={() => openEdit(user)}><FiEdit2 /></button>
                      <button className="icon-button small" title="Reset password" onClick={() => resetPassword(user)}><FiKey /></button>
                      <button className="icon-button small" title={user.isActive === false ? "Activate" : "Deactivate"} onClick={() => toggleStatus(user)}><FiPower /></button>
                      <button className="icon-button small danger-text" title="Delete" onClick={() => remove(user)}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState title="No employees found" description="Try a different search or filter." />}
      </section>
      {modal && (
        <Modal
          title={modal === "create" ? "Create employee account" : "Edit employee"}
          onClose={() => !submitting && setModal(null)}
          footer={<><button className="button ghost" onClick={() => setModal(null)}>Cancel</button><button className="button primary" form="employee-form" disabled={submitting}>{submitting ? "Saving…" : "Save employee"}</button></>}
        >
          {error && <div className="form-alert error">{error}</div>}
          <form id="employee-form" className="form-grid two" onSubmit={save}>
            <label className="field"><span>Full name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label className="field"><span>Email</span><input type="email" disabled={modal === "edit"} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            <label className="field"><span>Employee ID</span><input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} /></label>
            <label className="field"><span>Role</span><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="employee">Employee</option><option value="reportingOfficer">Reporting Officer</option><option value="reviewingOfficer">Reviewing Officer</option><option value="approvingAuthority">Approving Authority</option><option value="admin">Admin</option></select></label>
            <label className="field"><span>Department</span><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required /></label>
            <label className="field"><span>Designation</span><input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></label>
            <label className="field"><span>Employment type</span><select value={form.jobMode} onChange={(e) => setForm({ ...form, jobMode: e.target.value })}><option>Regular</option><option>Contract</option></select></label>
            <label className="field"><span>Date of joining</span><input type="date" value={form.dateOfJoining} onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })} required /></label>
            <label className="field"><span>Reporting Officer</span><select value={form.reportingOfficerId} onChange={(e) => setForm({ ...form, reportingOfficerId: e.target.value })}><option value="">Not assigned</option>{officers.reportingOfficer.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
            <label className="field"><span>Reviewing Officer</span><select value={form.reviewingOfficerId} onChange={(e) => setForm({ ...form, reviewingOfficerId: e.target.value })}><option value="">Not assigned</option>{officers.reviewingOfficer.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
            <label className="field full"><span>Approving Authority</span><select value={form.approvingAuthorityId} onChange={(e) => setForm({ ...form, approvingAuthorityId: e.target.value })}><option value="">Not assigned</option>{officers.approvingAuthority.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
          </form>
        </Modal>
      )}
    </>
  );
}
