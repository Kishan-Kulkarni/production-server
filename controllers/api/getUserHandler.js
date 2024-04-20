const User = require("../../models/User");
const s3 = require("../../config/s3Config");
const userBucket = process.env.USER_BUCKET_NAME;
const getFileStream = (key) => {
  const downloadParams = {
    Key: key,
    Bucket: userBucket,
  };
  return s3.getObject(downloadParams).promise();
};
const getUserHandler = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(400).send("Invalid userId");
  }
  const foundUser = await User.findById(userId).exec();
  if (!foundUser) {
    return res.status(400).send("The given user could not be found");
  }
  const readStream = await getFileStream(foundUser.pictureURL);
  return res.json({ name: foundUser.name, image: readStream.Body });
};
module.exports = getUserHandler;
