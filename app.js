import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import routes
import EmployeeAuthRouter from "./routes/EmployeeAuth.route.js";
import HRAuthrouter from "./routes/HRAuth.route.js";
import DashboardRouter from "./routes/Dashboard.route.js"; // fixed typo
import EmployeeRouter from "./routes/Employee.route.js";
import HRRouter from "./routes/HR.route.js";
import DepartmentRouter from "./routes/Department.route.js";
import SalaryRouter from "./routes/Salary.route.js";
import NoticeRouter from "./routes/Notice.route.js";
import LeaveRouter from "./routes/Leave.route.js";
import AttendanceRouter from "./routes/Attendance.route.js";
import RecruitmentRouter from "./routes/Recruitment.route.js"; // fixed typo
import ApplicantRouter from "./routes/Applicant.route.js";
import InterviewInsightRouter from "./routes/InterviewInsights.route.js";
import GenerateRequestRouter from "./routes/GenerateRequest.route.js";
import CorporateCalendarRouter from "./routes/CorporateCalendar.route.js";
import BalanceRouter from "./routes/Balance.route.js";

// Import DB connection
import sequelize from "./config/db.js";

dotenv.config();
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Mount routes
app.use("/api/auth/employee", EmployeeAuthRouter);
app.use("/api/auth/HR", HRAuthrouter);
app.use("/api/v1/dashboard", DashboardRouter);
app.use("/api/v1/employee", EmployeeRouter);
app.use("/api/v1/HR", HRRouter);
app.use("/api/v1/department", DepartmentRouter);
app.use("/api/v1/salary", SalaryRouter);
app.use("/api/v1/notice", NoticeRouter);
app.use("/api/v1/leave", LeaveRouter);
app.use("/api/v1/attendance", AttendanceRouter);
app.use("/api/v1/recruitment", RecruitmentRouter);
app.use("/api/v1/applicant", ApplicantRouter);
app.use("/api/v1/interview-insights", InterviewInsightRouter);
app.use("/api/v1/generate-request", GenerateRequestRouter);
app.use("/api/v1/corporate-calendar", CorporateCalendarRouter);
app.use("/api/v1/balance", BalanceRouter);

// Start server and connect DB
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate(); // test DB connection
    console.log("Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to database:", err);
    process.exit(1); // exit if DB connection fails
  }
};

startServer();
