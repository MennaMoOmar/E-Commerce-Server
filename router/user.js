const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../model/user");
const router = express.Router();
const { jwtSecret } = require("../config");
const auth = require("../middleware/auth");

/* signup */
router.post(
  "/register",
  body("email").isEmail().withMessage("invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be more than 5 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { firstName, lastName, email, password, isAdmin} = req.body;
      // check if user exists
      const isEmailTaken = await User.findOne({ email });
      if (isEmailTaken) {
        return res.status(400).json({ msg: " Email exists!!" });
      }

      // hash password
      const HashedPassword = await bcrypt.hash(password, 10);

      // register
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: HashedPassword,
        isAdmin,
      });

      // create token
      const token = await jwt.sign({ id: user.id }, jwtSecret);

      // create token
      const refreshToken = await jwt.sign({ id: user.id }, jwtSecret);

      res.json({
        idToken:token,
        email,
        password: HashedPassword,
        expiresIn: 3600,
        localId: user._id,
        isAdmin,
        refreshToken
        })
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

/* login */
router.post(
  "/login",
  body("email").exists().withMessage("email is required"),
  body("password").exists().withMessage("password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      // check if user does not exist
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "invalid email or password" });
      }
      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "invalid email or password" });
      }
      const token = await jwt.sign({ id: user.id }, jwtSecret);
      const refresgtoken = await jwt.sign({ id: user.id }, jwtSecret);
      res.json({
          localId:user._id,
          email:user.email,
          idToken: token,registered:true,
          refreshToken:refresgtoken,
          expiresIn:3600
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//api /user
router.get("/", auth, async (req, res) => {
  try {
    const id = req.id;
    const user = await User.findById(id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
