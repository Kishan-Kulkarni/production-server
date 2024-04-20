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
const getAllListings = async (req, res) => {
  let { type, offer, furnished, parking } = req.body;
  console.log({ type, offer, furnished, parking });
  let { start } = req.body;
  if (!start) {
    start = 0;
  }
  let foundPost;
  const query = {};
  if (!type && !offer && !furnished && !parking) {
    foundPost = await Post.find(query).skip(start).limit(10).exec();
  } else {
    if (offer) {
      if (offer === "true") {
        query.offer = true;
      } else {
        query.offer = false;
      }
    }
    if (furnished) {
      if (furnished === "true") {
        query.furnished = true;
      } else {
        query.furnished = false;
      }
    }
    if (parking) {
      if (parking === "true") {
        query.parking = true;
      } else {
        query.parking = false;
      }
    }
    if (type) {
      if (type === "sell") {
        query.sell = true;
      } else {
        query.sell = false;
      }
    }
    foundPost = await Post.find(query).skip(start).limit(10).exec();
  }
  const data = [];
  for (let i = 0; i < foundPost.length; i++) {
    const currPost = foundPost[i];
    const currPicture = currPost.pictureURLs[0];
    const result = await getFileStream(currPicture);
    data.push([...result.Body]);
  }
  res.json({ foundPost, data });
};
module.exports = getAllListings;
