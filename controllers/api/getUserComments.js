const Comment = require("../../models/Comment");
const getUserComments = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("Invalid userId");
  }
  const foundComments = await Comment.find({ userId: id })
    .sort({ updated: -1 })
    .exec();
  return res.json({ foundComments });
};
module.exports = getUserComments;
