import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>This page took some leave.</h1>
      <p>We couldn’t find the page you were looking for.</p>
      <Link className="button primary" to="/">Back to dashboard</Link>
    </main>
  );
}
