const express = require("express");
const router = express.Router();
const db = require("../models");
const axios = require("axios");

module.exports = {
  searchStocks: async (req, res) => {
    try {
      //   console.log("hitting api be api");
      const response = await axios.get(
        `https://finnhub.io/api/v1/search?q=${req.params.query}&token=${process.env.FINNHUB_TOKEN}`
      );

      const data = await response.data;

      return res.json(data);
    } catch (err) {
      return res.status(500).json({ error: `${err}. Failed to get stock` });
    }
  },

  getStock: async (req, res) => {
    try {
      console.log("hitting api be api");
      const profileResponse = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${req.params.symbol}&token=${process.env.FINNHUB_TOKEN}`
      );

      const financialsResponse = await axios.get(
        `https://finnhub.io/api/v1/stock/metric?symbol=${req.params.symbol}&metric=all&token=${process.env.FINNHUB_TOKEN}`
      );

      // const currentDate = Math.floor(Date.now() / 1000);
      // const oneYearAgoDate = currentDate - 31556925;

      // const chartResponse = await axios.get(
      //   `https://finnhub.io/api/v1/stock/candle?symbol=${req.params.symbol}&resolution=D&from=${oneYearAgoDate}&to=${currentDate}&token=${process.env.FINNHUB_TOKEN}`
      // );

      const staticPriceResponse = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${req.params.symbol}&token=${process.env.FINNHUB_TOKEN}`
      );

      const todayDate = new Date().toISOString().slice(0, 10);

      const newsResponse = await axios.get(
        `https://finnhub.io/api/v1/company-news?symbol=${req.params.symbol}&from=${todayDate}&to=${todayDate}&token=${process.env.FINNHUB_TOKEN}`
      );

      const profileData = await profileResponse.data;
      const financialsData = await financialsResponse.data;
      // const chartData = await chartResponse.data;
      const newsData = await newsResponse.data;
      const staticPriceData = await staticPriceResponse.data;

      return res.json({
        profile: profileData,
        financials: financialsData,
        // chart: chartData,
        news: newsData,
        staticPrice: staticPriceData,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: `${err}. Failed to get stock data` });
    }
  },

  getOneStockPrice: async (req, res) => {
    try {
      console.log("hitting api be api");

      const staticPriceResponse = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${req.params.symbol}&token=${process.env.FINNHUB_TOKEN}`
      );

      const staticPriceData = await staticPriceResponse.data;

      return res.json(staticPriceData);
    } catch (err) {
      return res
        .status(500)
        .json({ error: `${err}. Failed to get stock data` });
    }
  },

  getOneStockProfile: async (req, res) => {
    try {
      console.log("hitting api be api");

      const profileResponse = await axios.get(
        `https://finnhub.io/api/v1/stock/profile2?symbol=${req.params.symbol}&token=${process.env.FINNHUB_TOKEN}`
      );

      const profileResponseData = await profileResponse.data;

      return res.json(profileResponseData);
    } catch (err) {
      return res
        .status(500)
        .json({ error: `${err}. Failed to get stock data` });
    }
  },
};
