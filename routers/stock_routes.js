const express = require("express");
const stockController = require("../controllers/stock_controller");
const router = express.Router();
const authMiddleWare = require("../middleware/authmiddleware");

router.get("/search/:query", stockController.searchStocks);
router.get("/:symbol", stockController.getStock);
router.get("/oneprice/:symbol", stockController.getOneStockPrice);
router.get("/oneprofile/:symbol", stockController.getOneStockProfile);
// router.get("/checksession", userController.checkSession);
// router.get("/auth", authMiddleWare, userController.authExample);
// router.get("/profile", authMiddleware, userController.profile);

module.exports = router;
