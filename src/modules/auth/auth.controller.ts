// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { signupUser, signinUser } from "./auth.service";

export async function signup(req: Request, res: Response) {
  try {
    const user = await signupUser(req.body);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const result = await signinUser(req.body);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      status: "error",
      message: error.message,
    });
  }
}
