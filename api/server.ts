import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoute from "./router/auth";
import postsRoute from "./router/posts";
import cors from "cors";

const app = express();

const PORT = 5050;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
