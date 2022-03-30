const {
  getUTC,
  checkDate,
  transformDate,
  checkExpired,
  getRewardsRange,
} = require("../utils/date");
const { compose } = require("../utils/fp");

exports.getRewards = (req, res) => {
  if (!req.query.at || !checkDate(req.query.at)) {
    return res.status(422).json({
      data: [],
      error: "Something went wrong with your request!",
    });
  }
  const result = compose(transformDate, getRewardsRange)(req.query.at);
  const response = result.map(([available, expired]) => ({
    availableAt: available,
    expiresAt: expired,
    redeemedAt: null,
  }));

  // store the users data in the temporary storage
  global.users[req.params.id] = response;

  res.json({
    data: response,
  });
};

exports.redeemReward = (req, res) => {
  const { time, id } = req.params;
  if (!checkDate(time)) {
    return res.status(422).json({
      error: "Something went wrong with your request!",
    });
  }

  if (!global.users[id]) {
    return res.json({ error: "This reward is already expired" });
  }

  const rewards = global.users[id];

  const redeemCode = rewards.find((reward) => reward.availableAt === time);
  const today = new Date();
  if (
    redeemCode &&
    !checkExpired(today, transformDate(redeemCode?.expiresAt))
  ) {
    return res.json({
      data: {
        ...redeemCode,
        redeemedAt: getUTC(new Date()),
      },
    });
  }
  res.json({ error: "This reward is already expired" });
};
