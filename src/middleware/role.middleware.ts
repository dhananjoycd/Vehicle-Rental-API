import { Request, Response, NextFunction } from "express";

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const authorizeSelf = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loggedUser = (req as any).user;
  const targetUserId = req.params.userId;
  const customer_id = req.body?.customer_id;

  console.log(loggedUser.id, targetUserId);

  if (
    loggedUser.role === "admin" ||
    loggedUser.id === Number(targetUserId) ||
    loggedUser.id === customer_id
  ) {
    return next();
  }

  return res.status(403).json({
    message: "You are not allowed to perform this action",
  });
};
