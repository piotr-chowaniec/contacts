import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import "./env";
import { withAuth } from "./middleware";
import router from "./routes";

const app = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.use(clerkMiddleware());

app.head("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

app.use("/contact", withAuth, router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
