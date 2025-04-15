import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routers from "./routes/index.js";

const corsOptions = {
  origin: true,
  credentials: true,
};

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1", routers);

app.listen(8800, () => {
  console.log("Connected");
});
