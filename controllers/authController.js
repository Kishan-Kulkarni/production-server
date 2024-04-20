const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const authController = async (req, res) => {
  const cookie = req.cookies;
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).send("Username and Password required");
  }
  const foundUser = await User.findOne({ name: userName }).exec();
  if (!foundUser) {
    return res.status(401).send("Not authorized user");
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    //add secrets in the env
    const accessToken = jwt.sign(
      { userName: userName },
      process.env.ACCESSTOKENSECTRET,
      { expiresIn: "10m" }
    );
    const newRefreshToken = jwt.sign(
      { userName: userName },
      process.env.REFRESHTOKENSECTRET,
      { expiresIn: "1d" }
    );
    let newRefreshTokenArray = !cookie?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookie.jwt);
    if (cookie?.jwt) {
      const refreshToken = cookie.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();
      if (!foundToken) {
        newRefreshTokenArray = [];
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ accessToken, userName, userId: foundUser._id });
  }
  res.sendStatus(401);
};
module.exports = authController;
