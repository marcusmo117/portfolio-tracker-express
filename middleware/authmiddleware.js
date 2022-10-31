const db = require("../models");

module.exports = async (req, res, next) => {
  // middleware to check if session exists

  if (req.session.email) {
    const user = await db.user.findOne({
      where: {
        email: req.session.email,
      },
    });
    res.status(200).json({ message: "session is active", user });
    next();
  } else {
    res.status(404).json({ message: "session not existed" });
  }
};
