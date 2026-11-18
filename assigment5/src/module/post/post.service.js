import { fn, col } from "sequelize";
import { Post, User, Comment } from "../../DB/model/index.js";

const fail = (message, status) => new Error(message, { cause: { status } });

// POST /posts  (new instance + save)
export async function createPost(data = {}) {
  const { title, content, userId } = data;
  try {
    const post = new Post({ title, content, userId });
    await post.save();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      throw fail(error.errors.map((e) => e.message).join(", "), 400);
    }
    throw error;
  }
  return { message: "Post created successfully." };
}

// DELETE /posts/:postId  (owner only, soft delete)
export async function deletePost(postId, userId) {
  const post = await Post.findByPk(postId);
  if (!post) throw fail("Post not found.", 404);
  if (post.userId !== Number(userId)) {
    throw fail("You are not authorized to delete this post.", 403);
  }
  await post.destroy();
  return { message: "Post deleted." };
}

// GET /posts/details
export async function getPostsDetails() {
  return await Post.findAll({
    attributes: ["id", "title"],
    include: [
      { model: User, as: "user", attributes: ["id", "name"] },
      { model: Comment, as: "comments", attributes: ["id", "content"] },
    ],
  });
}

// GET /posts/comment-count
export async function getPostsCommentCount() {
  const posts = await Post.findAll({
    attributes: ["id", "title", [fn("COUNT", col("comments.id")), "commentCount"]],
    include: [{ model: Comment, as: "comments", attributes: [] }],
    group: ["Post.id"],
    subQuery: false,
  });
  return posts.map((p) => ({
    id: p.id,
    title: p.title,
    commentCount: Number(p.get("commentCount")),
  }));
}
