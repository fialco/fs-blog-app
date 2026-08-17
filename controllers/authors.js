const router = require("express").Router();

const { fn, col } = require("sequelize");
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      [col("user.name"), "author"],
      [fn("SUM", col("blog.likes")), "likes"],
      [fn("COUNT", col("blog.id")), "blogs"],
    ],
    include: {
      model: User,
      attributes: [],
    },
    group: "user.id",
    order: [["likes", "DESC"]],
  });
  res.json(authors);
});

module.exports = router;
