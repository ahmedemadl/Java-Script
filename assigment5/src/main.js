import express from "express";
import userController from "./module/user/user.controller.js";
import postController from "./module/post/post.controller.js";
import commentController from "./module/comment/comment.controller.js";
import globalErrorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/notfound.middleware.js";
import { PORT } from "./config/config.js";
import { checkConnection } from "./DB/connection.db.js";
import "./DB/model/index.js"; // registers models + associations

const app = express();

app.use(express.json());
app.use("/users", userController);
app.use("/posts", postController);
app.use("/comments", commentController);

app.all("{/*dummy}", notFoundMiddleware);
app.use(globalErrorMiddleware);

await checkConnection();

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}!`);
});
