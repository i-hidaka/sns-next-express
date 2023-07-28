import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const app = express();

const PORT = 5050;

const prisma = new PrismaClient();

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

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
