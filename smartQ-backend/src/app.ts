import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler";
import userRoutes from "./routes/user.routes";
import serviceRoutes from "./routes/service.routes";
import queueRoutes from "./routes/queue.routes";
import queueEntryRoutes from "./routes/queueEntry.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/services", serviceRoutes);
app.use("/queues", queueRoutes);
app.use("/entries", queueEntryRoutes);

// Test routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express");
});

app.post("/", (req: Request, res: Response) => {
  res.json(req.body);
});

// Error handler
app.use(errorHandler);

export default app;
