import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./src/routes/auth.route.js";
import taskRouter from "./src/routes/task.route.js";
import noteRouter from "./src/routes/notes.route.js";
import workSpaceRouter from "./src/routes/workspace.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN || "http://localhost:3000"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/workspaces", workSpaceRouter);

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;
