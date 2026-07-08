const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

/*
   Trust Render Reverse Proxy (Required for express-rate-limit)
 */
app.set("trust proxy", 1);

/* 
   Security Middleware
*/
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim())
      : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

/* 
   Health Check
*/
app.get("/api/health", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).json({
    success: true,
    service: "LeaveFlow API",
    timestamp: new Date().toISOString(),
  });
});

/* 
   Rate Limiter
 */
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

/* 
   Routes
*/
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/password", passwordRoutes);

/* 
   404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/*
   Global Error Handler
 */
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : error.message,
  });
});

/* 
   Server
*/
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 LeaveFlow API running on port ${PORT}`);
  });
}

module.exports = app;
