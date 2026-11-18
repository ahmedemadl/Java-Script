import { Router } from "express";
import * as service from "./user.service.js";

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const result = await service.signup(req.body);
  res.status(201).json(result);
});

userRouter.get("/by-email", async (req, res) => {
  const result = await service.getUserByEmail(req.query.email);
  res.status(200).json(result);
});

userRouter.put("/:id", async (req, res) => {
  const result = await service.createOrUpdateUser(req.params.id, req.body);
  res.status(200).json(result);
});

userRouter.get("/:id", async (req, res) => {
  const result = await service.getUserById(req.params.id);
  res.status(200).json(result);
});

export default userRouter;
