const router = require("express").Router();

const { ReadingList, User, Blog } = require("../models");

router.post("/", async (req, res, next) => {
  try {
    const { blogId, userId } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(400)
        .json({ error: "User with a given ID does not exist." });
    }

    const blog = await Blog.findByPk(blogId);

    if (!blog) {
      return res
        .status(400)
        .json({ error: "Blog with a given ID does not exist." });
    }

    const reading = await ReadingList.create({
      blogId,
      userId,
    });
    res.json(reading);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
