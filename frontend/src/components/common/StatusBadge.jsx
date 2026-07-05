const normalize = (status) => (status || "pending").toLowerCase();

export default function StatusBadge({ status }) {
  const value = normalize(status);
  const tone = value.includes("approved") || value.includes("recommended")
    ? "success"
    : value.includes("rejected")
      ? "danger"
      : value.includes("cancelled")
        ? "neutral"
        : "warning";
  return <span className={`status-badge ${tone}`}>{status || "Pending"}</span>;
}
