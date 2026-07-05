export default function Loader({ fullPage = false, label = "Loading" }) {
  return (
    <div className={fullPage ? "loader-page" : "loader-inline"} role="status">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
