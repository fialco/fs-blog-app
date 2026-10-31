const router = require("express").Router();

const Session = require("../models/session");
const { tokenExtractor, verifySession } = require("../util/middleware");

router.delete("/", tokenExtractor, verifySession, async (req, res) => {
  const userId = req.decodedToken.id;
  const token = req.token;
  const userSession = await Session.findOne({
    where: {
      userId,
      token,
    },
  });

  if (userSession) {
    Session.destroy({ where: { userId, token } });
    res.send(204);
  } else {
    res.send(401);
  }
});

module.exports = router;
