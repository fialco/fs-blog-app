const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

router.post("/", async (req, res) => {
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
