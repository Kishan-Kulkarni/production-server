const Comment = require("../../models/Comment");
const createComment = async (req, res) => {
  const { userId, postId, content } = req.body;
  if (!userId || !postId || !content) {
    res.status(400).send("Invalid comment. Needs valid Id and content");
  }
  const result = await Comment.create({
    userId,
    postId,
    content,
  });
  return res.status(204).send("Comment has been  created.");
};
module.exports = createComment;
