import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "firebase/auth";
import {
  FiBriefcase,
  FiEdit2,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { PageHeader } from "../../components/common/Ui";
import { formatDate, formatRole } from "../../utils/format";

export default function Profile() {
  const { user, firebaseUser, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    photoURL: user?.photoURL || "",
  });

  const [password, setPassword] = useState("");

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const save = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.patch("/auth/me", form);
      await refreshProfile();

      setEditing(false);
      setNotice("Profile updated successfully.");
    } catch (err) {
      setError(err.userMessage);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await updatePassword(firebaseUser, password);

      setPassword("");

      setNotice("Password changed successfully.");
    } catch (err) {
      setError(
        err.code === "auth/requires-recent-login"
          ? "For security, sign out and sign in again before changing your password."
          : err.message
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to logout.");
    }
  };

  const initials = user.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Your work details and account preferences."
      />

      {notice && <div className="form-alert success">{notice}</div>}
      {error && <div className="form-alert error">{error}</div>}

      <section className="profile-grid">

        {/* Left Profile Card */}

        <article className="panel profile-card">

          <div className="profile-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} />
            ) : (
              initials
            )}
          </div>

          <h2>{user.name}</h2>

          <p>{user.designation || formatRole(user.role)}</p>

          <span className="department-chip">
            {user.department || "No department"}
          </span>

          <button
            className="button secondary wide"
            onClick={() => setEditing((value) => !value)}
          >
            <FiEdit2 />
            Edit Profile
          </button>

          <dl className="profile-meta">
            <div>
              <FiMail />
              <span>
                <small>Email</small>
                <strong>{user.email}</strong>
              </span>
            </div>

            <div>
              <FiPhone />
              <span>
                <small>Phone</small>
                <strong>{user.phone || "Not added"}</strong>
              </span>
            </div>

            <div>
              <FiUser />
              <span>
                <small>Employee ID</small>
                <strong>{user.employeeId || "—"}</strong>
              </span>
            </div>
          </dl>
        </article>

        {/* Right Content */}

        <div className="profile-content">

          {/* Work Information */}

          <article className="panel">

            <div className="panel-header">
              <div>
                <p className="eyebrow">Employment</p>
                <h2>Work Information</h2>
              </div>

              <FiBriefcase />
            </div>

            <div className="info-grid">

              <div>
                <small>Department</small>
                <strong>{user.department || "—"}</strong>
              </div>

              <div>
                <small>Designation</small>
                <strong>{user.designation || "—"}</strong>
              </div>

              <div>
                <small>Employment Type</small>
                <strong>{user.jobMode || "—"}</strong>
              </div>

              <div>
                <small>Date of Joining</small>
                <strong>{formatDate(user.dateOfJoining)}</strong>
              </div>

              <div>
                <small>Role</small>
                <strong>{formatRole(user.role)}</strong>
              </div>

              <div>
                <small>Reporting Officer</small>
                <strong>
                  {user.reportingOfficerName ||
                    user.reportingOfficerId ||
                    "—"}
                </strong>
              </div>

            </div>

          </article>

          {/* Edit Profile */}

          {editing && (
            <form className="panel" onSubmit={save}>

              <div className="panel-header">
                <div>
                  <p className="eyebrow">Editable Details</p>
                  <h2>Update Profile</h2>
                </div>

                <FiEdit2 />
              </div>

              <div className="form-grid two">

                <label className="field">
                  <span>Full Name</span>

                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label className="field">
                  <span>Phone Number</span>

                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+91..."
                  />
                </label>

                <label className="field full">
                  <span>Profile Picture URL</span>

                  <input
                    type="url"
                    value={form.photoURL}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        photoURL: e.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </label>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="button ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>

                <button className="button primary">
                  Save Changes
                </button>

              </div>

            </form>
          )}

          {/* Security */}

          <form className="panel" onSubmit={changePassword}>

            <div className="panel-header">
              <div>
                <p className="eyebrow">Security</p>
                <h2>Change Password</h2>
              </div>

              <FiLock />
            </div>

            <div className="password-change">

              <label className="field">
                <span>New Password</span>

                <input
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
              </label>

              <button className="button secondary">
                Update Password
              </button>

              <button
                type="button"
                className="button danger wide"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>

          </form>

        </div>

      </section>
    </>
  );
}