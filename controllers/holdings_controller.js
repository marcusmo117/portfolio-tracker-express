const express = require("express");
const router = express.Router();
const db = require("../models");
const axios = require("axios");
const joi = require("joi");

const validators = {
  addHoldingsValidator: joi.object({
    email: joi.string().email().required(),
    ticker: joi.string().required(),
    tradeDate: joi.date().required(),
    quantity: joi.number().required(),
    costPerQuantity: joi.number().required(),
    customCategory: joi.string(),
  }),

  editHoldingsValidator: joi.object({
    email: joi.string().email().required(),
    ticker: joi.string().required(),
    tradeDate: joi.date().required(),
    quantity: joi.number().required(),
    costPerQuantity: joi.number().required(),
    customCategory: joi.string(),
  }),

  deleteHoldingsValidator: joi.object({
    email: joi.string().email().required(),
  }),
};

module.exports = {
  addHoldings: async (req, res) => {
    // joi validations (be validations)
    const formData = validators.addHoldingsValidator.validate(req.body);
    console.log("create new holdings: ", formData.value);
    if (formData.error) {
      return res.status(409).json({ message: formData.error.message });
    }

    //prep variables
    const {
      email,
      ticker,
      tradeDate,
      quantity,
      costPerQuantity,
      customCategory,
    } = formData.value;

    // check for existing email in db
    try {
      const emailExists = await db.user.findOne({
        where: { email },
      });
      if (!emailExists) {
        return res
          .status(409)
          .json({ message: "email not registered in db, please use another" });
      }
    } finally {
    }

    //creating/storing the holdings
    try {
      const holding = await db.holdings.create({
        email,
        ticker,
        tradeDate,
        quantity,
        costPerQuantity,
        customCategory,
      });

      res.status(200).json({ message: "holding is created", holding });
    } catch (err) {
      res.status(400).json(err.message);
    }
  },

  getHoldings: async (req, res) => {
    const email = req.params.email;
    try {
      const allHoldings = await db.holdings.findAll({
        where: { email },
      });
      res.status(200).json(allHoldings);
    } catch (err) {
      res.status(400).json(err.message);
    }
  },

  getOneHolding: async (req, res) => {
    const holdingsId = req.params.id;
    try {
      const holding = await db.holdings.findOne({
        where: { id: holdingsId },
      });
      if (!holding) {
        return res.status(409).json({
          message: "holding not registered in db, please try another",
        });
      }
      res.status(200).json(holding);
    } catch (err) {
      res.status(400).json(err.message);
    }
  },

  editHoldings: async (req, res) => {
    const holdingsId = req.params.id;

    // joi validations (be validations)
    const formData = validators.editHoldingsValidator.validate(req.body);
    console.log("edit new holdings: ", formData.value);
    if (formData.error) {
      return res.status(409).json({ message: formData.error.message });
    }

    //prep variables
    const {
      email,
      ticker,
      tradeDate,
      quantity,
      costPerQuantity,
      customCategory,
    } = formData.value;

    // check for existing holding in db and check user authority
    try {
      const holdingExists = await db.holdings.findOne({
        where: { id: holdingsId },
      });
      if (!holdingExists) {
        return res.status(409).json({
          message: "holding not registered in db, please try another",
        });
      }
      if (holdingExists.email.toString() !== email) {
        return res.status(409).json({
          message: "You are not authorised to edit this holding",
        });
      }
      console.log("checked for holdingsId in query params");
    } finally {
    }

    try {
      console.log("going to try to update db");
      const updatedHoldings = await db.holdings.update(
        { ticker, tradeDate, quantity, costPerQuantity, customCategory },
        { where: { id: holdingsId } }
      );
      res.status(200).json({ message: "holding is updated", updatedHoldings });
      console.log("success");
    } catch (err) {
      res.status(400).json(err.message);
      console.log("fail");
    }
  },

  deleteHoldings: async (req, res) => {
    const holdingsId = req.params.id;

    // joi validations (be validations)
    const formData = validators.deleteHoldingsValidator.validate(req.body);
    console.log("email that wants to delete holdings: ", formData.value);
    if (formData.error) {
      return res.status(409).json({ message: formData.error.message });
    }

    //prep variables
    const { email } = formData.value;

    // check for existing holding in db and check user authority
    try {
      const holdingExists = await db.holdings.findOne({
        where: { id: holdingsId },
      });
      if (!holdingExists) {
        return res.status(409).json({
          message: "holding not registered in db, please try another",
        });
      }
      if (holdingExists.email.toString() !== email) {
        return res.status(409).json({
          message: "You are not authorised to delete this holding",
        });
      }
      console.log("checked for holdingsId in query params");
    } finally {
    }

    try {
      console.log("going to try to delete holding");
      const deleteHolding = await db.holdings.destroy({
        where: { id: holdingsId },
      });
      res.status(200).json({ message: "holding is deleted" });
      console.log("success");
    } catch (err) {
      res.status(400).json(err.message);
      console.log("fail");
    }
  },
};
