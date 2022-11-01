const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const validators = {
  registerValidator: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
  }),
};

module.exports = {
  register: async (req, res) => {
    // joi validations (be validations)
    const formData = validators.registerValidator.validate(req.body);
    if (formData.error) {
      return res.status(409).json({ message: formData.error.message });
    }

    //prep variables
    const validatedEmail = formData.value.email;
    const validatedPassword = formData.value.password;

    //hashing the password
    const salt = await bcrypt.genSaltSync();
    const hashedPassword = await bcrypt.hashSync(validatedPassword, salt);

    // check for unique email
    try {
      const emailExists = await db.user.findOne({
        where: { email: validatedEmail },
      });
      if (emailExists) {
        return res
          .status(409)
          .json({ message: "email already registered, please use another" });
      }
    } finally {
    }

    //creating the user
    try {
      const user = await db.user.create({
        email: validatedEmail,
        password: hashedPassword,
      });

      // generate JWT and return as response
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5,
          data: validatedEmail,
        },
        process.env.JWT_SECRET
      );

      res.status(200).json({ message: "user is created", user, token: token });
    } catch (err) {
      res.status(400).json(err.message);
    }
  },

  login: async (req, res) => {
    //prep variables
    const { email, password } = req.body;
    console.log("hitting login endpoint");

    //checking if email exists and password matches
    try {
      const user = await db.user.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        res.status(404).json({ message: "incorrect email" });
        return;
      }

      //checking if password matches
      const isPasswordOk = await bcrypt.compare(password, user.password);
      if (!isPasswordOk) {
        return res.status(401).json({ message: "password is incorrect" });
      }

      // generate JWT and return as response
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5,
          data: email,
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({ message: `logged in succesfully!`, token: token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
