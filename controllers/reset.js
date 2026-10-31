const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");
const Session = require("../models/session");

router.post("/", async (req, res) => {
  await Session.destroy({
    where: {},
  });
  await ReadingList.destroy({
    where: {},
  });
  await Blog.destroy({
    where: {},
  });
  await User.destroy({
    where: {},
  });
  res.sendStatus(200);
});

module.exports = router;
