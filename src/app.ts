import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import apiRoutes from "./routes";
import { notFoundHandler } from "./middlewares/notFound";
import { errorHandler } from "./middlewares/errorHandler";
import { env } from "./config/env";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
  }),
);

if (env.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Cloud Notes API is running",
  });
});

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;