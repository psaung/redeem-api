var express = require("express");
const { getRewards, redeemReward } = require("../controllers/userController");
var router = express.Router();

/* GET users listing. */
router.get("/:id/rewards", getRewards);
router.patch("/:id/rewards/:time/redeem", redeemReward);

module.exports = router;
