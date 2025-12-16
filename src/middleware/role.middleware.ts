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
  const targetUserId = req.params?.userId;
  const customer_id = req.body?.customer_id;

  if (
    loggedUser.role === "admin" ||
    loggedUser.id === Number(targetUserId) ||
    loggedUser.id === Number(customer_id)
  ) {
    return next();
  }

  return res.status(403).json({
    message: "You are not allowed to perform this action",
  });
};

export const bookingAuthor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loggedUser = (req as any).user;
  const customer_status = req.body?.status;

  if (
    loggedUser.role === "admin" ||
    (loggedUser.role === "customer" && customer_status === "cancelled")
  ) {
    return next();
  }

  return res.status(403).json({
    message: "You are not allowed to perform this action",
  });
};
