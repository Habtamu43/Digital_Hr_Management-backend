import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import EmployeeAuthRouter from "./routes/EmployeeAuth.route.js";
import HRAuthRouter from "./routes/HRAuth.route.js";
import DashboardRouter from "./routes/Dashboard.route.js";
import EmployeeRouter from "./routes/Employee.route.js";
import HRRouter from "./routes/HR.route.js";
import DepartmentRouter from "./routes/Department.route.js";
import SalaryRouter from "./routes/Salary.route.js";
import NoticeRouter from "./routes/Notice.route.js";
import LeaveRouter from "./routes/Leave.route.js";
import AttendanceRouter from "./routes/Attendance.route.js";
import RecruitmentRouter from "./routes/Recruitment.route.js";
import ApplicantRouter from "./routes/Applicant.route.js";
import InterviewInsightRouter from "./routes/InterviewInsights.route.js";
import GenerateRequestRouter from "./routes/GenerateRequest.route.js";
import CorporateCalendarRouter from "./routes/CorporateCalendar.route.js";
import BalanceRouter from "./routes/Balance.route.js";

// Swagger
import { swaggerUi, swaggerSpec } from "./swagger.js";

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());
app.use(cookieParser());

/**
 * ✅ FIXED CORS CONFIG (IMPORTANT FOR COOKIES)
 */
app.use(
  cors({
    origin: "https://digital-hr-management-frontend.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

/* =======================
   SWAGGER
======================= */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* =======================
   DEBUG LOGGER
======================= */
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

/* =======================
   TEST ROUTE
======================= */
app.post("/test", (req, res) => {
  console.log("Test body:", req.body);
  res.json({ received: req.body });
});

/* =======================
   ROUTES
======================= */
app.use("/api/auth/employee", EmployeeAuthRouter);
app.use("/api/auth/hr", HRAuthRouter);

app.use("/api/v1/dashboard", DashboardRouter);
app.use("/api/v1/employee", EmployeeRouter);
app.use("/api/v1/hr", HRRouter);
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

export default app;