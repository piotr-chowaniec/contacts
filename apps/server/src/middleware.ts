import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
};
