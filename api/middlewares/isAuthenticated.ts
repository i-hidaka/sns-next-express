import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization!.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "権限がありません。" });
  }
  jwt.verify(token, process.env.SECRET_KEY!, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "権限がありません。" });
    }
    req.body.userId = (decoded as { id: number }).id;

    next();
  });
};
