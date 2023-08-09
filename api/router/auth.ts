import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateIdenticon } from "../utils/generateIdenticon";

const prisma = new PrismaClient();
const router = express.Router();

// 新規ユーザー登録
router.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const defaultIconImage = generateIdenticon(email);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profile: {
          create: { bio: "はじめまして", profileImageUrl: defaultIconImage },
        },
      },
      include: { profile: true },
    });

    return res.json({ user });
  }
);

// ログイン
router.post("/login", async (req: express.Request, res: express.Response) => {
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

export default router;
