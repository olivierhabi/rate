import express from "express";
import appRouter from "./routes";

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }));
app.get("/", (req, res) =>
  res.status(200).json({ message: "Welcome to API rate limiter" })
);
app.use(appRouter);

export default app;
