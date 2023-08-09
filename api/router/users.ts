import express from "express";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const prisma = new PrismaClient();
const router = express.Router();

router.get(
  "/find",
  isAuthenticated,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.body.userId },
      });

      if (!user) {
        res.status(404).json({ error: "ユーザーが見つかりませんでした。" });
      }

      res.status(200).json({
        user: { id: user?.id, email: user?.email, username: user?.username },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/profile/:userId",
  async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;

    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: parseInt(userId) },
        include: { user: { include: { profile: true } } },
      });
      if (!profile) {
        return res
          .status(404)
          .json({ message: "プロフィールが見つかりませんでした。" });
      }
      res.status(200).json(profile);
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  }
);
export default router;
