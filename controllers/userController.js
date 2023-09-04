const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

//@desc Post registration
//@route POST /user/registration
//@access public
const registration = asyncHandler(async (req, res) => {
  // we use async function in all the methods because when we interact with mongoDB it returns a promise. async used for handling promises better way
  const { username, email, password } = req.body;
  //   HASHING PASSWORD USING BCRYPT NPM
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!username || !password || !email) {
    res.status(404);
    throw new Error("All fields are required!!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User is already available.");
  }
  console.log("Hashed password is: " + hashedPassword);
  const registerUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  console.log("Registered successfully");
  if (registerUser) {
    res.status(201).json(registerUser);
  }
});

//@desc Post registration
//@route POST /user/registration
//@access public
const login = asyncHandler(async (req, res) => {
  // res.status(200).json({ message: "login working fine " });

  // we use async function in all the methods because when we interact with mongoDB it returns a promise. async used for handling promises better way
  const { email, password } = req.body;
 

  if (!email && !password) {
    res.status(400);
    throw new Error("All fields are required!");
  }
  const userExist = await User.findOne({ email });
  console.log(email, password, userExist.password);
  if (!userExist) {
    res.status(404);
    throw new Error("User does not exist");
  }

  if (userExist && (await bcrypt.compare(password, userExist.password))) {
    const accessToken = jwt.sign(
      {
        // JWT.sign will return an access token which is created whenever user is logged in and
        //  we will store it in session and we will validate using this token
        user: {
          username: userExist.username,
          email: userExist.email,
          id: userExist._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    res.status(200).json({ accessToken });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });

    // return res.status(404).json({ message: "Password is incorrect" });
  } else {
    res.status(401);
    throw new Error("email or password is inot valid");
  }
});
//@desc Post registration
//@route POST /user/registration
//@access public
const current = asyncHandler(async (req, res) => {
  // we use async function in all the methods because when we interact with mongoDB it returns a promise. async used for handling promises better way
  res.status(200).json(req.user);
});

module.exports = {
  registration,
  login,
  current,
};
