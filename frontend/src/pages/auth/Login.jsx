import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { auth } from "../../firebase/firebase";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { HOME_BY_ROLE } from "../../components/common/ProtectedRoute";

export default function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to={HOME_BY_ROLE[user.role] || "/"} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await setPersistence(
        auth,
        form.remember ? browserLocalPersistence : browserSessionPersistence
      );
      const credential = await signInWithEmailAndPassword(auth, form.email, form.password);
      await login(credential);
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential"
          ? "The email or password is incorrect."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

const resetPassword = async () => {
  setError("");
  setMessage("");

  if (!form.email) {
    setError("Enter your email first.");
    return;
  }

  try {
    const { data } = await api.post("/password/forgot", {
      email: form.email,
    });

    setMessage(data.message);
  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Unable to send reset email."
    );
  }
};

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-brand"><span>L</span> LeaveFlow</div>
        <div className="story-copy">
          <p className="eyebrow light">One place for time away</p>
          <h1>Leave should feel simple—for everyone.</h1>
          <p>Apply, review and plan with a transparent workflow that keeps every person in the loop.</p>
          <div className="story-points">
            <span><FiCheck /> Clear multi-level approvals</span>
            <span><FiCheck /> Live balances and holiday-aware dates</span>
            <span><FiCheck /> Secure, role-based access</span>
          </div>
        </div>
        <div className="trust-line"><FiShield /> Protected by Firebase Authentication</div>
      </section>
      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="mobile-login-brand"><span>L</span> LeaveFlow</div>
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="muted">Use the account provided by your administrator.</p>
          {error && <div className="form-alert error">{error}</div>}
          {message && <div className="form-alert success">{message}</div>}
          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="name@organisation.com"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <span className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Enter your password"
                required
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </span>
          </label>
          <div className="form-options">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) => setForm({ ...form, remember: event.target.checked })}
              />
              Remember me
            </label>
            <button type="button" className="text-button" onClick={resetPassword}>Forgot password?</button>
          </div>
          <button className="button primary wide" disabled={loading}>
            {loading ? <span className="spinner small" /> : <>Sign in <FiArrowRight /></>}
          </button>
          <p className="login-help">Having trouble? Contact your HR administrator.</p>
        </form>
      </section>
    </main>
  );
}
