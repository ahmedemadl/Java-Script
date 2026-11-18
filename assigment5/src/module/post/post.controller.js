import { Router } from "express";
import * as service from "./post.service.js";

const postRouter = Router();

postRouter.post("/", async (req, res) => {
  const result = await service.createPost(req.body);
  res.status(201).json(result);
});

postRouter.get("/details", async (req, res) => {
  res.status(200).json(await service.getPostsDetails());
});

postRouter.get("/comment-count", async (req, res) => {
  res.status(200).json(await service.getPostsCommentCount());
});

// body: { "userId": <id of the user performing the action> }
postRouter.delete("/:postId", async (req, res) => {
  const result = await service.deletePost(req.params.postId, req.body?.userId);
  res.status(200).json(result);
});

export default postRouter;
