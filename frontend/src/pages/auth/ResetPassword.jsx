import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post("/password/reset", {
        token,
        password,
      });

      setMessage("Password changed successfully.");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to reset password."
      );
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>

          <h2>Reset Password</h2>

          {error && (
            <div className="form-alert error">
              {error}
            </div>
          )}

          {message && (
            <div className="form-alert success">
              {message}
            </div>
          )}

          <label className="field">
            <span>New Password</span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Confirm Password</span>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>

          <button className="button primary wide">
            Reset Password
          </button>

        </form>
      </section>
    </main>
  );
}