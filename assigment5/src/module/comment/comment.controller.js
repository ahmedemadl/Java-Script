import { Router } from "express";
import * as service from "./comment.service.js";

const commentRouter = Router();

commentRouter.post("/", async (req, res) => {
  res.status(201).json(await service.createBulkComments(req.body));
});

commentRouter.post("/find-or-create", async (req, res) => {
  const result = await service.findOrCreateComment(req.body);
  res.status(result.created ? 201 : 200).json(result);
});

commentRouter.get("/search", async (req, res) => {
  res.status(200).json(await service.searchComments(req.query.word));
});

commentRouter.get("/newest/:postId", async (req, res) => {
  res.status(200).json(await service.getNewestComments(req.params.postId));
});

commentRouter.get("/details/:id", async (req, res) => {
  res.status(200).json(await service.getCommentDetails(req.params.id));
});

commentRouter.patch("/:commentId", async (req, res) => {
  res.status(200).json(await service.updateComment(req.params.commentId, req.body));
});

export default commentRouter;
