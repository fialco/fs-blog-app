const router = require("express").Router();

const { User, Blog } = require("../models");

router.post("/", async (req, res) => {
  await User.destroy({
    where: {},
  });
  await Blog.destroy({
    where: {},
  });
  res.send(200);
});

module.exports = router;
