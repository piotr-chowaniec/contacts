import { AuthObject } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const withAuth = (
  req: Request & { auth?: AuthObject },
  res: Response,
  next: NextFunction,
) => {
  const userId = req.auth?.userId;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
};
