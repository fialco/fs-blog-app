const router = require("express").Router();

const Session = require("../models/session");
const { tokenExtractor, verifySession } = require("../util/middleware");

router.delete("/", tokenExtractor, verifySession, async (req, res, next) => {
  try {
    const userId = req.decodedToken.id;
    const userSession = await Session.findAll({
      where: {
        userId,
      },
    });

    if (userSession) {
      await Session.destroy({ where: { userId } });
      res.status(204).send("Logged out successfully");
    } else {
      res.status(401).send("Error logging out");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
