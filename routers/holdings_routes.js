const express = require("express");
const holdingsController = require("../controllers/holdings_controller");
const router = express.Router();
const authMiddleWare = require("../middleware/authmiddleware");

// router.get("/search/:query", stockController.searchStocks);
router.post("/", holdingsController.addHoldings);
router.get("/:email", holdingsController.getHoldings);
router.get("/one/:id", holdingsController.getOneHolding);
router.put("/edit/:id", holdingsController.editHoldings);
router.delete("/delete/:id", holdingsController.deleteHoldings);
// router.get("/checksession", userController.checkSession);
// router.get("/auth", authMiddleWare, userController.authExample);
// router.get("/profile", authMiddleware, userController.profile);

module.exports = router;
