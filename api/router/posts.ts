import express from "express";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const prisma = new PrismaClient();
const router = express.Router();

// つぶやき投稿
router.post(
  "/post",
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "投稿内容がありません。" });
    }
    try {
      const newPost = await prisma.post.create({
        data: {
          content,
          authorID: req.body.userId,
        },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
        },
      });
      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "サーバーエラーです。" });
    }
  }
);

// 最新つぶやき取得
router.get(
  "/get_latest_post",
  async (req: express.Request, res: express.Response) => {
    try {
      const latestPosts = await prisma.post.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { author: { include: { profile: true } } },
      });
      res.json(latestPosts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "サーバーエラーです。" });
    }
  }
);

export default router;
