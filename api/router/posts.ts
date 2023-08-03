import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// つぶやき投稿
router.post("/post", async (req: express.Request, res: express.Response) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "投稿内容がありません。" });
  }
  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorID: 6,
      },
    });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

export default router;
