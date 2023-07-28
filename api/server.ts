import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

const PORT = 5050;

const prisma = new PrismaClient();

app.use(express.json());

// 新規ユーザー登録
app.post(
  "/api/auth/register",
  async (req: express.Request, res: express.Response) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return res.json({ user });
  }
);

// ログイン
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({
      error: "そのユーザーは存在しません。",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "そのパスワードは間違っています" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });

  return res.json({ token });
});

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
