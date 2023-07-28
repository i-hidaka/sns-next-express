import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();

const PORT = 5050;

const prisma = new PrismaClient();

app.post(
  "/api/auth/register",
  async (req: express.Request, res: express.Response) => {
    const { username, email, password } = req.body;

    const user = await prisma.user.create({
      data: { username, email, password },
    });

    return res.json({ user });
  }
);

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
