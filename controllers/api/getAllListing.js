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
  let { type, offer, furnished, parking } = req.params;
  let foundPost;
  const query = {};
  if (offer) {
    if (offer === "true") {
      query.offer = true;
    } else if (offer === "false") {
      query.offer = false;
    }
  }
  if (furnished) {
    if (furnished === "true") {
      query.furnished = true;
    } else if (furnished === "false") {
      query.furnished = false;
    }
  }
  if (parking) {
    if (parking === "true") {
      query.parking = true;
    } else if (parking === "false") {
      query.parking = false;
    }
  }
  if (type) {
    if (type === "sell") {
      query.sell = true;
    } else if (type === "rent") {
      query.sell = false;
    }
  }
  foundPost = await Post.find(query).exec();
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
