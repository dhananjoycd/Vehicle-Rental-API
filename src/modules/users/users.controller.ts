import { Request, Response } from "express";
import {
  deleteUserByID,
  getAllUsers,
  getUserById,
  updateUserByID,
} from "./users.service";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
}
export async function getUserByID(req: Request, res: Response) {
  const targetUserId = req.params.userId;
  try {
    const users = await getUserById(targetUserId);
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export const updateUserById = async (req: Request, res: Response) => {
  const id = req.params.userId;
  const user = await updateUserByID(id, req.body);
  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const deleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  await deleteUserByID(userId);

  res.json({ message: "User deleted successfully" });
};
