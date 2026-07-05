export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <h2 className="footer-title">
          LeaveFlow
        </h2>

        <p className="footer-subtitle">
          Leave Management System
        </p>

        <p className="footer-copy">
  ©       {new Date().getFullYear()} LeaveFlow. All Rights Reserved.
        </p>
        
        <div className="footer-divider"></div>

        <p className="footer-heading">
          Developed by
        </p>

        <p className="footer-name">
          Suprakash Debnath
        </p>

        <p className="footer-name">
          Chayanika Debnath
        </p>

        <p className="footer-course">
          B.Tech Computer Science & Engineering
        </p>

        <p className="footer-college">
          ICFAI University Tripura
        </p>

        <p className="footer-version">
          Version 1.0.0
        </p>

      </div>
    </footer>
  );
}