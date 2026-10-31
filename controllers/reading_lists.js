const router = require("express").Router();

const { ReadingList, User, Blog } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const { blogId, userId } = req.body;

    const loggedUser = await User.findByPk(req.decodedToken.id, {
      attributes: { exclude: ["hashedPassword"] },
    });
    const readingListUser = await User.findByPk(userId);

    if (
      !loggedUser ||
      !readingListUser ||
      loggedUser.id !== readingListUser.id
    ) {
      return res.status(400).json({ error: "User id invalid" });
    }

    const blog = await Blog.findByPk(blogId);

    if (!blog) {
      return res
        .status(400)
        .json({ error: "Blog with a given ID does not exist." });
    }

    const readingListBlog = await ReadingList.findOne({
      where: { userId: userId, blogId: blogId },
    });

    if (readingListBlog) {
      return res
        .status(400)
        .json({ error: "Blog already in user's reading list" });
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

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    const { read } = req.body;

    const loggedUser = await User.findByPk(req.decodedToken.id, {
      attributes: { exclude: ["hashedPassword"] },
    });
    const readingListBlog = await ReadingList.findByPk(req.params.id);

    if (!readingListBlog) {
      return res.status(400).json({ error: "Blog with given ID not found" });
    }

    if (!loggedUser || loggedUser.id !== readingListBlog.userId) {
      return res.status(400).json({ error: "User id invalid" });
    }

    readingListBlog.read = read;
    await readingListBlog.save();

    res.json(readingListBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
