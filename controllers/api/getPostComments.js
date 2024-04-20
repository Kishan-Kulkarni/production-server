const Comment = require("../../models/Comment");
const getPostComment = async (req, res) => {
  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).send("Inavlid postId");
  }
  const foundComments = await Comment.find({ postId })
    .sort({ updatedAt: -1 })
    .exec();
  return res.json({ foundComments });
};
module.exports = getPostComment;
