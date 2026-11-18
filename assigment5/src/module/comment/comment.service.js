import { Op } from "sequelize";
import { Comment, User, Post } from "../../DB/model/index.js";

const fail = (message, status) => new Error(message, { cause: { status } });

// POST /comments  (bulk)
export async function createBulkComments(data = {}) {
  const { comments } = data;
  if (!Array.isArray(comments) || !comments.length) {
    throw fail("comments array is required", 400);
  }
  await Comment.bulkCreate(comments, { validate: true });
  return { message: "comments created." };
}

// PATCH /comments/:commentId   body: { userId, content }
export async function updateComment(commentId, data = {}) {
  const { userId, content } = data;
  const comment = await Comment.findByPk(commentId);
  if (!comment) throw fail("comment not found.", 404);
  if (comment.userId !== Number(userId)) {
    throw fail("You are not authorized to update this comment.", 403);
  }
  await comment.update({ content });
  return { message: "Comment updated." };
}

// POST /comments/find-or-create
export async function findOrCreateComment(data = {}) {
  const { postId, userId, content } = data;
  const [comment, created] = await Comment.findOrCreate({
    where: { postId, userId, content },
  });
  return { comment, created };
}

// GET /comments/search?word=
export async function searchComments(word) {
  const { count, rows } = await Comment.findAndCountAll({
    where: { content: { [Op.like]: `%${word}%` } },
  });
  if (!count) throw fail("no comments found.", 404);
  return { count, comments: rows };
}

// GET /comments/newest/:postId
export async function getNewestComments(postId) {
  return await Comment.findAll({
    where: { postId },
    order: [["createdAt", "DESC"]],
    limit: 3,
    attributes: ["id", "content", "createdAt"],
  });
}

// GET /comments/details/:id
export async function getCommentDetails(id) {
  const comment = await Comment.findByPk(id, {
    attributes: ["id", "content"],
    include: [
      { model: User, as: "user", attributes: ["id", "name", "email"] },
      { model: Post, as: "post", attributes: ["id", "title", "content"] },
    ],
  });
  if (!comment) throw fail("no comment found", 404);
  return comment;
}
