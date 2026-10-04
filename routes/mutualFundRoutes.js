const express = require("express");
const router = express.Router();

const {
    searchMutualFundsController
} = require("../controllers/mutualFundController");

router.get("/search", searchMutualFundsController);

module.exports = router;