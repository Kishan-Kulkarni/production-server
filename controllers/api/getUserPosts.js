const s3 = require("../../config/s3Config");
const Post = require("../../models/Post");
const bucketName = process.env.AWS_BUCKET_NAME;
const getFileStream = (key) => {
  const downloadParams = {
    Key: key,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).promise();
};
const getUserPosts = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("Invalid userId");
  }
  const foundPosts = await Post.find({ userId: id }).sort({ views: -1 }).exec();
  const data = [];
  for (let i = 0; i < foundPosts.length; i++) {
    const currPicture = foundPosts[i].pictureURLs[0];
    const result = await getFileStream(currPicture);
    data.push(result.Body);
  }
  return res.json({
    posts: {
      foundPosts,
      data,
    },
  });
};
module.exports = getUserPosts;
